-- Netra AI Traffic Optimization Database Schema
-- PostgreSQL Database Setup

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'police', 'user')),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Cities table
CREATE TABLE IF NOT EXISTS cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    population INTEGER,
    traffic_density_score INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Traffic intersections table
CREATE TABLE IF NOT EXISTS traffic_intersections (
    id SERIAL PRIMARY KEY,
    city_id INTEGER REFERENCES cities(id),
    name VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    signal_timing_north INTEGER DEFAULT 30,
    signal_timing_south INTEGER DEFAULT 30,
    signal_timing_east INTEGER DEFAULT 25,
    signal_timing_west INTEGER DEFAULT 25,
    current_phase VARCHAR(20) DEFAULT 'north',
    is_active BOOLEAN DEFAULT true,
    emergency_override BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Traffic violations table
CREATE TABLE IF NOT EXISTS traffic_violations (
    id SERIAL PRIMARY KEY,
    intersection_id INTEGER REFERENCES traffic_intersections(id),
    vehicle_number VARCHAR(20),
    violation_type VARCHAR(50) NOT NULL,
    confidence_score DECIMAL(5, 4),
    image_url VARCHAR(500),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'detected' CHECK (status IN ('detected', 'verified', 'dismissed')),
    created_by INTEGER REFERENCES users(id)
);

-- Real-time traffic data table
CREATE TABLE IF NOT EXISTS traffic_data (
    id SERIAL PRIMARY KEY,
    intersection_id INTEGER REFERENCES traffic_intersections(id),
    vehicle_count INTEGER DEFAULT 0,
    pedestrian_count INTEGER DEFAULT 0,
    traffic_density VARCHAR(20) DEFAULT 'low',
    average_speed DECIMAL(5, 2),
    congestion_level INTEGER DEFAULT 0,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    weather_condition VARCHAR(50),
    visibility VARCHAR(20)
);

-- ML model predictions table
CREATE TABLE IF NOT EXISTS ml_predictions (
    id SERIAL PRIMARY KEY,
    intersection_id INTEGER REFERENCES traffic_intersections(id),
    model_type VARCHAR(50) NOT NULL,
    prediction_data JSONB,
    confidence_score DECIMAL(5, 4),
    processing_time_ms INTEGER,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- File storage table
CREATE TABLE IF NOT EXISTS file_storage (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255),
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    uploaded_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table for authentication
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_traffic_data_intersection_timestamp ON traffic_data(intersection_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_violations_intersection_timestamp ON traffic_violations(intersection_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert sample data
INSERT INTO cities (name, state, latitude, longitude, population, traffic_density_score) VALUES
('Mumbai', 'Maharashtra', 19.0760, 72.8777, 12442373, 95),
('Delhi', 'Delhi', 28.7041, 77.1025, 11007835, 92),
('Bangalore', 'Karnataka', 12.9716, 77.5946, 8443675, 88),
('Chennai', 'Tamil Nadu', 13.0827, 80.2707, 4646732, 85),
('Kolkata', 'West Bengal', 22.5726, 88.3639, 4496694, 82),
('Hyderabad', 'Telangana', 17.3850, 78.4867, 3943323, 80),
('Pune', 'Maharashtra', 18.5204, 73.8567, 3124458, 78),
('Ahmedabad', 'Gujarat', 23.0225, 72.5714, 5633927, 75),
('Jaipur', 'Rajasthan', 26.9124, 75.7873, 3046163, 72),
('Surat', 'Gujarat', 21.1702, 72.8311, 4467797, 70);

-- Insert sample admin user (password: admin123)
INSERT INTO users (email, password_hash, role, name) VALUES
('admin@netra.ai', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'admin', 'System Administrator');
