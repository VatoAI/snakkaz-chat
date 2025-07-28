-- Snakkaz Memory System Database Schema
-- Initial setup for PostgreSQL/Supabase

-- Enable vector extension if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- Main memories table
CREATE TABLE IF NOT EXISTS snakkaz_memories (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    memory_type TEXT NOT NULL,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    embedding vector(1536), -- OpenAI ada-002 embedding size
    metadata JSONB DEFAULT '{}',
    confidence REAL DEFAULT 1.0,
    importance REAL DEFAULT 0.5,
    access_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    context TEXT,
    source TEXT,
    
    -- Ensure unique user_id + key combination
    UNIQUE(user_id, key)
);

-- Memory collections for organizing memories
CREATE TABLE IF NOT EXISTS snakkaz_memory_collections (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, name)
);

-- Link memories to collections (many-to-many)
CREATE TABLE IF NOT EXISTS snakkaz_memory_collection_items (
    collection_id INTEGER REFERENCES snakkaz_memory_collections(id) ON DELETE CASCADE,
    memory_id INTEGER REFERENCES snakkaz_memories(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    PRIMARY KEY (collection_id, memory_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_memories_user_id ON snakkaz_memories(user_id);
CREATE INDEX IF NOT EXISTS idx_memories_type ON snakkaz_memories(memory_type);
CREATE INDEX IF NOT EXISTS idx_memories_created_at ON snakkaz_memories(created_at);
CREATE INDEX IF NOT EXISTS idx_memories_importance ON snakkaz_memories(importance);
CREATE INDEX IF NOT EXISTS idx_memories_embedding ON snakkaz_memories USING ivfflat (embedding vector_cosine_ops);

-- Row Level Security (RLS) for Supabase
-- NOTE: These PostgreSQL-specific RLS commands are not compatible with SQL Server
/* 
-- PostgreSQL only (do not uncomment when using SQL Server):
-- ALTER TABLE snakkaz_memories ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE snakkaz_memory_collections ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE snakkaz_memory_collection_items ENABLE ROW LEVEL SECURITY;
*/

-- NOTE: RLS Policies below are PostgreSQL-specific and have been commented out
-- You'll need to implement row-level security using SQL Server's security features if needed

/*
-- RLS Policies (assuming auth.uid() is available in Supabase)
CREATE POLICY "Users can view own memories" ON snakkaz_memories 
    FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "Users can insert own memories" ON snakkaz_memories 
    FOR INSERT WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update own memories" ON snakkaz_memories 
    FOR UPDATE USING (user_id = auth.uid()::text);

CREATE POLICY "Users can delete own memories" ON snakkaz_memories 
    FOR DELETE USING (user_id = auth.uid()::text);

-- Similar policies for collections
CREATE POLICY "Users can view own collections" ON snakkaz_memory_collections 
    FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "Users can manage own collections" ON snakkaz_memory_collections 
    FOR ALL USING (user_id = auth.uid()::text);

-- Collection items inherit permissions from parent collections
CREATE POLICY "Users can manage collection items" ON snakkaz_memory_collection_items 
    FOR ALL USING (
        collection_id IN (
            SELECT id FROM snakkaz_memory_collections 
            WHERE user_id = auth.uid()::text
        )
    );
*/

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update timestamps
CREATE TRIGGER update_memories_updated_at 
    BEFORE UPDATE ON snakkaz_memories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collections_updated_at 
    BEFORE UPDATE ON snakkaz_memory_collections 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Optional: Create some example memory types as ENUM for validation
-- (Can be commented out if flexibility is preferred)
/*
CREATE TYPE memory_type_enum AS ENUM (
    'user_preference',
    'conversation_context', 
    'learned_fact',
    'emotional_state',
    'task_context',
    'user_relationship',
    'interaction_pattern'
);

-- Add check constraint
ALTER TABLE snakkaz_memories 
ADD CONSTRAINT check_memory_type 
CHECK (memory_type IN (
    'user_preference',
    'conversation_context', 
    'learned_fact',
    'emotional_state',
    'task_context',
    'user_relationship',
    'interaction_pattern'
));
*/
