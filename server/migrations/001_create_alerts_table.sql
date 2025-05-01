CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    parameter VARCHAR(50) NOT NULL,
    condition VARCHAR(20) NOT NULL,
    threshold DECIMAL(10,2) NOT NULL,
    unit VARCHAR(10) NOT NULL,
    is_triggered BOOLEAN DEFAULT FALSE,
    state VARCHAR(20) DEFAULT 'active',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_checked TIMESTAMP WITH TIME ZONE,
    cleared_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT valid_parameter CHECK (parameter IN ('temperature', 'windSpeed', 'humidity', 'visibility', 'precipitation')),
    CONSTRAINT valid_condition CHECK (condition IN ('greater_than', 'less_than', 'equal_to')),
    CONSTRAINT valid_state CHECK (state IN ('active', 'triggered', 'clear', 'disabled'))
);

-- Create index for faster lookups
CREATE INDEX idx_alerts_state ON alerts(state);
CREATE INDEX idx_alerts_location ON alerts(location);
CREATE INDEX idx_alerts_last_checked ON alerts(last_checked);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_alerts_updated_at
    BEFORE UPDATE ON alerts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 