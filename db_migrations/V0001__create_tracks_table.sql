CREATE TABLE IF NOT EXISTS tracks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    duration VARCHAR(10) NOT NULL,
    audio_url TEXT NOT NULL,
    cover_url TEXT,
    plays INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tracks_genre ON tracks(genre);
CREATE INDEX idx_tracks_artist ON tracks(artist);
CREATE INDEX idx_tracks_uploaded_at ON tracks(uploaded_at DESC);