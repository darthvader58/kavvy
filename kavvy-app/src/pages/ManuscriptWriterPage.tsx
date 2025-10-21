// src/pages/ManuscriptWriterPage.tsx
import { useState } from 'react';
import type { Author, Publisher } from '../types';
import { publishers } from '../data/publishers';

interface ManuscriptWriterPageProps {
  author: Author;
}

export function ManuscriptWriterPage({ author }: ManuscriptWriterPageProps) {
  const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(null);
  const [manuscriptText, setManuscriptText] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  const analyzeManuscript = () => {
    // Simulate AI analysis
    const wordCount = manuscriptText.split(/\s+/).filter(w => w.length > 0).length;
    const sentences = manuscriptText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgWordsPerSentence = sentences.length > 0 ? Math.round(wordCount / sentences.length) : 0;

    setAnalysisResults({
      wordCount,
      sentenceCount: sentences.length,
      avgWordsPerSentence,
      readabilityScore: Math.min(100, Math.max(0, 100 - (avgWordsPerSentence * 2))),
    });
  };

  const generateAISuggestion = () => {
    if (!selectedPublisher) {
      setAiSuggestion('Please select a target publisher first to get tailored suggestions.');
      return;
    }

    // Simulate AI suggestions based on publisher
    const suggestions = [
      `Based on ${selectedPublisher.name}'s preferences for ${selectedPublisher.genres[0]}, consider strengthening your opening hook to immediately engage readers in this genre.`,
      `${selectedPublisher.name} typically publishes works with strong character development. Ensure your protagonist has clear motivations and a compelling arc.`,
      `For ${selectedPublisher.name}, focus on vivid sensory details that immerse readers in your ${selectedPublisher.genres[0]} world.`,
      `${selectedPublisher.name} values unique perspectives. Highlight what makes your narrative voice distinct in the ${selectedPublisher.genres[0]} market.`,
    ];

    setAiSuggestion(suggestions[Math.floor(Math.random() * suggestions.length)]);
  };

  return (
    <div className="main-container">
      <div className="publishers-header" style={{ gridColumn: '1 / -1' }}>
        <h1>AI Manuscript Writer</h1>
        <p>Get AI-powered suggestions tailored to your target publisher's preferences and genre requirements.</p>
      </div>

      <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem' }}>
        {/* Left Sidebar - Tools */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="widget">
            <h3>Target Publisher</h3>
            <select 
              value={selectedPublisher?.name || ''} 
              onChange={(e) => {
                const pub = publishers.find(p => p.name === e.target.value);
                setSelectedPublisher(pub || null);
              }}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '0.9rem',
                marginTop: '0.5rem'
              }}
            >
              <option value="">Select a publisher...</option>
              {publishers.slice(0, 15).map(pub => (
                <option key={pub.name} value={pub.name}>{pub.name}</option>
              ))}
            </select>

            {selectedPublisher && (
              <div style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
                <div style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }}>
                  <strong>Genres:</strong>
                </div>
                <div className="publisher-tags">
                  {selectedPublisher.genres.slice(0, 3).map((genre, idx) => (
                    <span key={idx} className="tag primary">{genre}</span>
                  ))}
                </div>
                <div style={{ marginTop: '0.75rem', color: 'var(--text-light)' }}>
                  <strong>Requirements:</strong>
                  <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem' }}>
                    <li>Agent: {selectedPublisher.requiresAgent ? 'Required' : 'Not Required'}</li>
                    <li>Manuscript: {selectedPublisher.manuscriptNeeded ? 'Full' : 'Partial'}</li>
                    <li>Status: {selectedPublisher.openCalls ? '✓ Open' : '✗ Closed'}</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="widget">
            <h3>AI Tools</h3>
            <button 
              className="btn-primary" 
              style={{ width: '100%', marginBottom: '0.75rem' }}
              onClick={generateAISuggestion}
              disabled={!selectedPublisher}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px', marginRight: '0.5rem' }}>
                <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                <path d="M2 17L12 22L22 17"/>
                <path d="M2 12L12 17L22 12"/>
              </svg>
              Get AI Suggestion
            </button>

            <button 
              className="btn-secondary" 
              style={{ width: '100%', marginBottom: '0.75rem' }}
              onClick={analyzeManuscript}
              disabled={!manuscriptText}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px', marginRight: '0.5rem' }}>
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21L16.65 16.65"/>
              </svg>
              Analyze Text
            </button>

            <button 
              className="btn-secondary" 
              style={{ width: '100%' }}
              disabled
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px', marginRight: '0.5rem' }}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              Premium: Proofread
            </button>
          </div>

          {analysisResults && (
            <div className="widget">
              <h3>Analysis Results</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                <div className="info-row">
                  <span className="info-label">Words</span>
                  <span className="info-value">{analysisResults.wordCount}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Sentences</span>
                  <span className="info-value">{analysisResults.sentenceCount}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Avg Words/Sentence</span>
                  <span className="info-value">{analysisResults.avgWordsPerSentence}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Readability</span>
                  <span className="info-value" style={{ color: 'var(--success)' }}>
                    {analysisResults.readabilityScore}/100
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Editor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {aiSuggestion && (
            <div className="widget" style={{ background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%)', color: 'white' }}>
              <h3 style={{ color: 'white', marginBottom: '0.75rem' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '20px', height: '20px', marginRight: '0.5rem', verticalAlign: 'middle' }}>
                  <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                  <path d="M2 17L12 22L22 17"/>
                  <path d="M2 12L12 17L22 12"/>
                </svg>
                AI Suggestion
              </h3>
              <p style={{ lineHeight: 1.6, opacity: 0.95 }}>{aiSuggestion}</p>
            </div>
          )}

          <div className="widget">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Your Manuscript</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="icon-btn" title="Bold">
                  <strong>B</strong>
                </button>
                <button className="icon-btn" title="Italic">
                  <em>I</em>
                </button>
                <button className="icon-btn" title="Underline">
                  <u>U</u>
                </button>
              </div>
            </div>

            <textarea
              value={manuscriptText}
              onChange={(e) => setManuscriptText(e.target.value)}
              placeholder="Start writing your manuscript here... The AI will analyze your text and provide suggestions based on your target publisher's preferences."
              style={{
                width: '100%',
                minHeight: '500px',
                padding: '1rem',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '1rem',
                lineHeight: 1.8,
                fontFamily: 'Georgia, serif',
                resize: 'vertical'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', color: 'var(--text-light)', fontSize: '0.85rem' }}>
              <span>{manuscriptText.split(/\s+/).filter(w => w.length > 0).length} words</span>
              <span>Auto-saved 2 minutes ago</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-primary" style={{ flex: 1 }}>
              Save Draft
            </button>
            <button className="btn-secondary" style={{ flex: 1 }}>
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}