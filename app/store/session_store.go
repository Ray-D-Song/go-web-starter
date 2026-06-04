package store

import (
	"crypto/rand"
	"encoding/hex"
	"sync"
	"time"
)

// SessionStore manages in-memory sessions with automatic expiration
type SessionStore struct {
	sessions map[string]*Session
	mu       sync.RWMutex
	maxAge   time.Duration
}

// Session represents a user session
type Session struct {
	UserID    uint
	CreatedAt time.Time
	ExpiresAt time.Time
}

// NewSessionStore creates a new in-memory session store
func NewSessionStore(maxAge time.Duration) *SessionStore {
	store := &SessionStore{
		sessions: make(map[string]*Session),
		maxAge:   maxAge,
	}

	// Start background cleanup goroutine
	go store.cleanupExpiredSessions()

	return store
}

// Create generates a new random session ID and stores the session
func (s *SessionStore) Create(userID uint) (string, error) {
	sessionID, err := generateSessionID()
	if err != nil {
		return "", err
	}

	now := time.Now()
	session := &Session{
		UserID:    userID,
		CreatedAt: now,
		ExpiresAt: now.Add(s.maxAge),
	}

	s.mu.Lock()
	s.sessions[sessionID] = session
	s.mu.Unlock()

	return sessionID, nil
}

// Get retrieves a session by ID and validates expiration
func (s *SessionStore) Get(sessionID string) (uint, bool) {
	s.mu.RLock()
	session, exists := s.sessions[sessionID]
	s.mu.RUnlock()

	if !exists {
		return 0, false
	}

	// Check if session has expired
	if time.Now().After(session.ExpiresAt) {
		s.Delete(sessionID)
		return 0, false
	}

	return session.UserID, true
}

// Delete removes a session from the store
func (s *SessionStore) Delete(sessionID string) {
	s.mu.Lock()
	delete(s.sessions, sessionID)
	s.mu.Unlock()
}

// DeleteByUserID removes all sessions for a specific user
func (s *SessionStore) DeleteByUserID(userID uint) {
	s.mu.Lock()
	defer s.mu.Unlock()

	for id, session := range s.sessions {
		if session.UserID == userID {
			delete(s.sessions, id)
		}
	}
}

// Count returns the total number of active sessions
func (s *SessionStore) Count() int {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return len(s.sessions)
}

// cleanupExpiredSessions runs periodically to remove expired sessions
func (s *SessionStore) cleanupExpiredSessions() {
	ticker := time.NewTicker(1 * time.Hour)
	defer ticker.Stop()

	for range ticker.C {
		now := time.Now()
		s.mu.Lock()
		for id, session := range s.sessions {
			if now.After(session.ExpiresAt) {
				delete(s.sessions, id)
			}
		}
		s.mu.Unlock()
	}
}

// generateSessionID creates a cryptographically secure random session ID
func generateSessionID() (string, error) {
	bytes := make([]byte, 32) // 256 bits
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}
