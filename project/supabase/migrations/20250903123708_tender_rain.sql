/*
  # Configuración inicial de base de datos para Blackjack

  1. Nuevas Tablas
    - `profiles` - Perfiles de usuario con estadísticas
      - `id` (uuid, primary key, referencia a auth.users)
      - `username` (text, único)
      - `chips` (integer, fichas del usuario)
      - `wins` (integer, partidas ganadas)
      - `losses` (integer, partidas perdidas)
      - `ties` (integer, empates)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `game_records` - Historial de partidas
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `bet_amount` (integer, cantidad apostada)
      - `result` (text, resultado: win/loss/tie)
      - `player_score` (integer, puntuación del jugador)
      - `dealer_score` (integer, puntuación de la casa)
      - `created_at` (timestamp)

  2. Seguridad
    - RLS habilitado en todas las tablas
    - Políticas para que usuarios solo vean sus propios datos
    - Trigger para crear perfil automáticamente al registrarse
*/

-- Tabla de perfiles de usuario
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  chips integer DEFAULT 1000,
  wins integer DEFAULT 0,
  losses integer DEFAULT 0,
  ties integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de historial de partidas
CREATE TABLE IF NOT EXISTS game_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  bet_amount integer NOT NULL,
  result text NOT NULL CHECK (result IN ('win', 'loss', 'tie')),
  player_score integer NOT NULL,
  dealer_score integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_records ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Políticas para game_records
CREATE POLICY "Users can read own game records"
  ON game_records
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own game records"
  ON game_records
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at en profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_profiles_updated_at'
  ) THEN
    CREATE TRIGGER update_profiles_updated_at
      BEFORE UPDATE ON profiles
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Función para crear perfil automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, chips, wins, losses, ties)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    1000,
    0,
    0,
    0
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;