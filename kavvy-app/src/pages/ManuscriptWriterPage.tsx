// src/pages/ManuscriptWriterPage.tsx
import { useState } from 'react';
import type { Author, Publisher } from '../types';
import { publishers } from '../data/publishers';

interface ManuscriptWriterPageProps {
  author: Author;
}

interface AISuggestion {
  type: 'improvement' | 'warning' | 'insight';
  title: string;
  description: string;
  line?: number;
}

export function ManuscriptWriterPage({ author }: ManuscriptWriterPageProps) {
  const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(null);
  const [manuscriptText, setManuscriptText] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [showAIPanel, setShowAIPanel] = useState(true);

  // Mock AI suggestions based on text
  const generateAISuggestions = () => {
    const mockSuggestions: AISuggestion[] = [
      {
        type: 'improvement',
        title: 'Show, Don\'t Tell',
        description: 'Consider showing the character\'s emotions through actions rather than stating them directly.',
        line: 3
      },
      {
        type: 'insight',
        title: 'Strong Opening Hook',
        description: 'Your opening paragraph effectively captures reader attention with vivid imagery.',
        line: 1
      },
      {
        type: 'warning',
        title: 'Pacing Consideration',
        description: 'This section might benefit from tighter pacing to maintain momentum.',
        line: 12
      },
      {
        type: 'improvement',
        title: 'Dialogue Enhancement',
        description: 'Adding dialogue tags or body language could strengthen character voice here.',
        line: 8
      }
    ];

    if (selectedPublisher) {
      mockSuggestions.push({
        type: 'insight',
        title: `Publisher Match: ${selectedPublisher.name}`,
        description: `Your manuscript aligns well with ${selectedPublisher.name}'s preference for ${selectedPublisher.genres[0]}. Consider emphasizing themes of ${selectedPublisher.subjects[0].toLowerCase()}.`
      });
    }

    setAiSuggestions(mockSuggestions);
  };

  const analyzeManuscript = () => {
    const wordCount = manuscriptText.split(/\s+/).filter(w => w.length > 0).length;
    const sentences = manuscriptText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgWordsPerSentence = sentences.length > 0 ? Math.round(wordCount / sentences.length) : 0;
    const paragraphs = manuscriptText.split(/\n\n+/).filter(p => p.trim().length > 0);

    // Mock genre detection
    const detectedGenre = author.genres[0] || 'Literary Fiction';
    const toneScore = Math.min(100, Math.max(60, 75 + Math.random() * 15));
    const paceScore = Math.min(100, Math.max(60, 70 + Math.random() * 20));

    setAnalysisResults({
      wordCount,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      avgWordsPerSentence,
      readabilityScore: Math.min(100, Math.max(0, 100 - (avgWordsPerSentence * 2))),
      detectedGenre,
      toneScore: Math.round(toneScore),
      paceScore: Math.round(paceScore),
      estimatedReadTime: Math.ceil(wordCount / 200), // avg reading speed
    });

    generateAISuggestions();
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'improvement':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="#D4A574" strokeWidth="2" style={{ width: '20px', height: '20px' }}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        );
      case 'warning':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="#E59866" strokeWidth="2" style={{ width: '20px', height: '20px' }}>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        );
      case 'insight':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="#5C946E" strokeWidth="2" style={{ width: '20px', height: '20px' }}>
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="main-container" style={{ gridTemplateColumns: showAIPanel ? '300px 1fr 350px' : '1fr', maxWidth: '1600px' }}>
      {/* Left Sidebar - Settings */}
      {showAIPanel && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="widget">
            <h3>Manuscript Settings</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '0.5rem' }}>
                  Target Genre
                </label>
                <select style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.9rem', background: 'var(--card-bg)', color: 'var(--text)' }}>
                  <option>{author.genres[0] || 'Select genre...'}</option>
                  <option>Science Fiction</option>
                  <option>Fantasy</option>
                  <option>Literary Fiction</option>
                  <option>Mystery</option>
                  <option>Romance</option>
                  <option>Young Adult</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '0.5rem' }}>
                  Target Publisher
                </label>
                <select 
                  value={selectedPublisher?.name || ''} 
                  onChange={(e) => {
                    const pub = publishers.find(p => p.name === e.target.value);
                    setSelectedPublisher(pub || null);
                  }}
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.9rem', background: 'var(--card-bg)', color: 'var(--text)' }}
                >
                  <option value="">Optional...</option>
                  {publishers.slice(0, 10).map(pub => (
                    <option key={pub.name} value={pub.name}>{pub.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="widget">
            <h3>AI Writing Tools</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
              <button 
                className="btn-primary" 
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                onClick={analyzeManuscript}
                disabled={!manuscriptText}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px' }}>
                  <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                  <path d="M2 17L12 22L22 17"/>
                  <path d="M2 12L12 17L22 12"/>
                </svg>
                Analyze with AI
              </button>

              <button 
                className="btn-secondary" 
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                onClick={generateAISuggestions}
                disabled={!manuscriptText}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px' }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Get Suggestions
              </button>

              <button 
                className="btn-secondary" 
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                disabled
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px' }}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Premium: Proofread
              </button>
            </div>
          </div>

          {analysisResults && (
            <div className="widget">
              <h3>Manuscript Stats</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', marginTop: '1rem' }}>
                <div className="info-row">
                  <span className="info-label">Words</span>
                  <span className="info-value">{analysisResults.wordCount.toLocaleString()}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Paragraphs</span>
                  <span className="info-value">{analysisResults.paragraphCount}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Read Time</span>
                  <span className="info-value">{analysisResults.estimatedReadTime} min</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Readability</span>
                  <span className="info-value" style={{ color: 'var(--success)' }}>
                    {analysisResults.readabilityScore}/100
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Tone Match</span>
                  <span className="info-value" style={{ color: analysisResults.toneScore > 75 ? 'var(--success)' : 'var(--accent)' }}>
                    {analysisResults.toneScore}%
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Pacing</span>
                  <span className="info-value" style={{ color: analysisResults.paceScore > 75 ? 'var(--success)' : 'var(--accent)' }}>
                    {analysisResults.paceScore}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Editor */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="widget" style={{ padding: '1.5rem 2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--primary)' }}>Kavvy Pen</h1>
            <button 
              className="icon-btn"
              onClick={() => setShowAIPanel(!showAIPanel)}
              title={showAIPanel ? 'Hide AI panel' : 'Show AI panel'}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="9" y1="3" x2="9" y2="21"/>
              </svg>
            </button>
          </div>
          <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>
            Write with confidence using AI-powered suggestions tailored to your genre and target publishers
          </p>
        </div>

        <div className="widget">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Your Manuscript</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="icon-btn" title="Bold">
                <strong style={{ fontSize: '0.95rem' }}>B</strong>
              </button>
              <button className="icon-btn" title="Italic">
                <em style={{ fontSize: '0.95rem' }}>I</em>
              </button>
              <button className="icon-btn" title="Underline">
                <u style={{ fontSize: '0.95rem' }}>U</u>
              </button>
              <div style={{ width: '1px', background: 'var(--border)', margin: '0 0.25rem' }}></div>
              <button className="icon-btn" title="Undo">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 7v6h6"/>
                  <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"/>
                </svg>
              </button>
              <button className="icon-btn" title="Redo">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 7v6h-6"/>
                  <path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7"/>
                </svg>
              </button>
            </div>
          </div>

          <textarea
            value={manuscriptText}
            onChange={(e) => setManuscriptText(e.target.value)}
            placeholder="Chapter One

The morning light filtered through the dusty windows of the old library, casting long shadows across the worn wooden floors. Emma ran her fingers along the spine of an ancient tome, feeling the roughness of centuries-old leather beneath her touch.

She had been searching for this book for months—a mythical collection of stories that supposedly held the key to..."
            style={{
              width: '100%',
              minHeight: '600px',
              padding: '1.5rem',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '1.05rem',
              lineHeight: 1.8,
              fontFamily: 'Georgia, serif',
              resize: 'vertical',
              background: 'var(--card-bg)',
              color: 'var(--text)'
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', color: 'var(--text-light)', fontSize: '0.85rem' }}>
            <span>{manuscriptText.split(/\s+/).filter(w => w.length > 0).length} words</span>
            <span>Auto-saved 1 minute ago</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-primary" style={{ flex: 1 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px', marginRight: '0.5rem' }}>
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
              <polyline points="7 3 7 8 15 8"/>
            </svg>
            Save Draft
          </button>
          <button className="btn-secondary" style={{ flex: 1 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px', marginRight: '0.5rem' }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export
          </button>
        </div>
      </div>

      {/* Right Sidebar - AI Suggestions */}
      {showAIPanel && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="widget">
            <h3>AI Suggestions</h3>
            {aiSuggestions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-light)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '48px', height: '48px', margin: '0 auto 1rem', opacity: 0.5 }}>
                  <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                  <path d="M2 17L12 22L22 17"/>
                  <path d="M2 12L12 17L22 12"/>
                </svg>
                <p style={{ fontSize: '0.9rem' }}>
                  Start writing or click "Get Suggestions" to receive AI-powered feedback
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                {aiSuggestions.map((suggestion, idx) => (
                  <div 
                    key={idx} 
                    style={{ 
                      padding: '1rem', 
                      background: 'var(--bg)', 
                      borderRadius: '8px',
                      borderLeft: `3px solid ${suggestion.type === 'improvement' ? '#D4A574' : suggestion.type === 'warning' ? '#E59866' : '#5C946E'}`
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                      {getSuggestionIcon(suggestion.type)}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)', marginBottom: '0.5rem' }}>
                          {suggestion.title}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', lineHeight: 1.5 }}>
                          {suggestion.description}
                        </div>
                        {suggestion.line && (
                          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-light)', opacity: 0.8 }}>
                            Line {suggestion.line}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedPublisher && (
            <div className="widget" style={{ background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%)', color: 'white' }}>
              <h3 style={{ color: 'white', marginBottom: '1rem' }}>
                Target Publisher
              </h3>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                {selectedPublisher.name}
              </div>
              <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '1rem' }}>
                {selectedPublisher.location}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {selectedPublisher.genres.slice(0, 3).map((genre, idx) => (
                  <span key={idx} style={{ background: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem' }}>
                    {genre}
                  </span>
                ))}
              </div>
              <div style={{ marginTop: '1rem', fontSize: '0.85rem', opacity: 0.9 }}>
                {selectedPublisher.openCalls ? '✓ Currently accepting submissions' : '✗ Submissions closed'}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}