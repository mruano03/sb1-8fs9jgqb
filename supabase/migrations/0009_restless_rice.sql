/*
  # Add Forms and Form Responses Tables
  
  1. New Tables
    - forms: Stores form definitions and settings
    - form_responses: Stores form submission data
    
  2. Security
    - Enable RLS on all tables
    - Users can manage their own forms
    - Public can submit responses to published forms
    
  3. Features
    - Form versioning support
    - Custom fields and validation
    - Response tracking
*/

-- Create forms table
CREATE TABLE IF NOT EXISTS public.forms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    fields JSONB DEFAULT '[]'::jsonb,
    settings JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    version INTEGER DEFAULT 1,
    responses_count INTEGER DEFAULT 0,
    published_at TIMESTAMPTZ
);

-- Create form responses table
CREATE TABLE IF NOT EXISTS public.form_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
    data JSONB NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'validated', 'rejected'))
);

-- Create triggers for updated_at
CREATE TRIGGER update_forms_updated_at
    BEFORE UPDATE ON forms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_form_responses_updated_at
    BEFORE UPDATE ON form_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_responses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for forms
CREATE POLICY "Users can view their own forms"
    ON forms FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can create their own forms"
    ON forms FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own forms"
    ON forms FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own forms"
    ON forms FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

-- Create RLS policies for form responses
CREATE POLICY "Users can view responses to their forms"
    ON form_responses FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM forms
            WHERE forms.id = form_id
            AND forms.user_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can submit responses to published forms"
    ON form_responses FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM forms
            WHERE forms.id = form_id
            AND forms.status = 'published'
        )
    );

-- Create indexes
CREATE INDEX idx_forms_user_id ON forms(user_id);
CREATE INDEX idx_forms_status ON forms(status);
CREATE INDEX idx_forms_created_at ON forms(created_at);
CREATE INDEX idx_form_responses_form_id ON form_responses(form_id);
CREATE INDEX idx_form_responses_created_at ON form_responses(created_at);
CREATE INDEX idx_forms_fields ON forms USING gin (fields);
CREATE INDEX idx_form_responses_data ON form_responses USING gin (data);