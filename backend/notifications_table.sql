-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('accepted', 'rejected', 'suspended', 'pending') DEFAULT 'pending',
  read_status BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at),
  INDEX idx_read_status (read_status)
);

-- Add last_scrape_attempt column to student_coding_profiles if not exists
ALTER TABLE student_coding_profiles 
ADD COLUMN IF NOT EXISTS last_scrape_attempt TIMESTAMP NULL;