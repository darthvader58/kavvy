// src/pages/MatchesPage.tsx
import { Author, Match } from '../types';
import { publishers } from '../data/publishers';
import { PublisherCard } from '../components/PublisherCard';

interface MatchesPageProps {
  author: Author;
}

export function MatchesPage({ author }: MatchesPageProps) {
  // Simple matching algorithm
  const calculateMatches = (): Match[] => {
    return publishers.map(publisher => {
      let score = 0;
      const reasons: string[] = [];

      // Genre match
      const genreMatch = publisher.genres.some(g => 
        author.genres.some(ag => ag.toLowerCase().includes(g.toLowerCase()) || g.toLowerCase().includes(ag.toLowerCase()))
      );
      if (genreMatch) {
        score += 40;
        reasons.push(`Publishes your genre: ${author.genres.join(', ')}`);
      }

      // Subject match
      const subjectMatch = publisher.subjects.some(s => 
        author.subjects.some(as => as.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(as.toLowerCase()))
      );
      if (subjectMatch) {
        score += 30;
        reasons.push('Subject matter alignment');
      }

      // No agent required (author doesn't have one)
      if (!author.hasAgent && !publisher.requiresAgent) {
        score += 15;
        reasons.push('Accepts direct submissions (no agent required)');
      }

      // Open submissions
      if (publisher.openCalls) {
        score += 10;
        reasons.push('Currently accepting submissions');
      }

      // Manuscript status
      if (author.manuscriptStatus === 'complete' && publisher.manuscriptNeeded) {
        score += 5;
        reasons.push('Your completed manuscript matches their requirements');
      }

      return { publisher, score, reasons };
    }).sort((a, b) => b.score - a.score);
  };

  const matches = calculateMatches();

  const getScoreClass = (score: number): string => {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  };

  return (
    <div className="main-container">
      <div className="publishers-header">
        <h1>Your Publisher Matches</h1>
        <p>Based on your profile, genres, and manuscript status, here are publishers that might be a great fit for you.</p>
      </div>

      <div className="matches-container">
        {matches.slice(0, 10).map((match, idx) => (
          <div key={idx} className="match-card">
            <div className={`match-score-indicator ${getScoreClass(match.score)}`}>
              {match.score}%
            </div>
            <div style={{ flex: 1 }}>
              <PublisherCard publisher={match.publisher} />
              {match.reasons.length > 0 && (
                <div className="match-reasons">
                  <h4>Why this match?</h4>
                  <ul>
                    {match.reasons.map((reason, ridx) => (
                      <li key={ridx}>{reason}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}