export interface Step {
  id: string;
  time: string;
  icon: string;
  content: string;
}

export interface Destination {
  id: string;
  name: string;
  steps: Step[];
  tips?: string[];
  foodRecommendations?: string[];
}

export interface Day {
  id: string;
  title: string;
  description: string;
  destinations: Destination[];
}

export interface ItineraryData {
  title: string;
  intro: string;
  days: Day[];
  costBreakdown: string[];
  outro: string;
}

export interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  dayId: string;
}

// Rome locations for the map
export const romeLocations: Location[] = [
  {
    id: 'spanish-steps',
    name: 'Spanish Steps & Piazza di Spagna',
    lat: 41.9055,
    lng: 12.4823,
    dayId: 'day-1'
  },
  {
    id: 'trevi-fountain',
    name: 'Trevi Fountain',
    lat: 41.9009,
    lng: 12.4833,
    dayId: 'day-1'
  },
  {
    id: 'colosseum',
    name: 'Colosseum',
    lat: 41.8902,
    lng: 12.4922,
    dayId: 'day-2'
  },
  {
    id: 'roman-forum',
    name: 'Roman Forum & Palatine Hill',
    lat: 41.8925,
    lng: 12.4853,
    dayId: 'day-2'
  },
  {
    id: 'vatican',
    name: 'Vatican Museums & Sistine Chapel',
    lat: 41.9065,
    lng: 12.4534,
    dayId: 'day-3'
  },
  {
    id: 'st-peters',
    name: "St. Peter's Basilica",
    lat: 41.9023,
    lng: 12.4544,
    dayId: 'day-3'
  },
  {
    id: 'castel-sant-angelo',
    name: 'Castel Sant\'Angelo',
    lat: 41.9031,
    lng: 12.4663,
    dayId: 'day-3'
  },
  {
    id: 'pantheon',
    name: 'Pantheon',
    lat: 41.8986,
    lng: 12.4769,
    dayId: 'day-4'
  },
  {
    id: 'piazza-navona',
    name: 'Piazza Navona',
    lat: 41.8991,
    lng: 12.4731,
    dayId: 'day-4'
  },
  {
    id: 'campo-de-fiori',
    name: "Campo de' Fiori",
    lat: 41.8955,
    lng: 12.4705,
    dayId: 'day-4'
  },
  {
    id: 'trastevere',
    name: 'Trastevere',
    lat: 41.8894,
    lng: 12.4698,
    dayId: 'day-5'
  },
  {
    id: 'villa-borghese',
    name: 'Villa Borghese Gardens',
    lat: 41.9108,
    lng: 12.4844,
    dayId: 'day-5'
  },
  {
    id: 'pincio-terrace',
    name: 'Pincio Terrace',
    lat: 41.9128,
    lng: 12.4770,
    dayId: 'day-5'
  }
];

function generateId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function extractTimeAndIcon(text: string): { time: string; icon: string; content: string } {
  const timeIconMatch = text.match(/^(-\s*)([\u{1F300}-\u{1F9FF}])\s*(Morning|Afternoon|Evening|Night):\s*/u);
  if (timeIconMatch) {
    return {
      icon: timeIconMatch[2],
      time: timeIconMatch[3],
      content: text.slice(timeIconMatch[0].length)
    };
  }
  // For non-time items (food, tips)
  const iconMatch = text.match(/^(-\s*)([\u{1F300}-\u{1F9FF}])\s*/u);
  if (iconMatch) {
    return {
      icon: iconMatch[2],
      time: '',
      content: text.slice(iconMatch[0].length)
    };
  }
  return {
    icon: '📍',
    time: '',
    content: text.replace(/^-\s*/, '')
  };
}

export function parseMarkdown(content: string): ItineraryData {
  const lines = content.split('\n');
  const result: ItineraryData = {
    title: '',
    intro: '',
    days: [],
    costBreakdown: [],
    outro: ''
  };

  let currentSection: 'title' | 'intro' | 'day' | 'destination' | 'tips' | 'food' | 'cost' | 'outro' = 'title';
  let currentDay: Day | null = null;
  let currentDestination: Destination | null = null;
  let introLines: string[] = [];
  let outroLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Title (# header)
    if (line.startsWith('# ')) {
      result.title = line.slice(2).trim();
      currentSection = 'intro';
      continue;
    }

    // Day header (## Day X)
    if (line.startsWith('## Day ')) {
      // Save previous day
      if (currentDay) {
        if (currentDestination) {
          currentDay.destinations.push(currentDestination);
        }
        result.days.push(currentDay);
      }

      const dayMatch = line.match(/## Day (\d+):?\s*(.*)/);
      if (dayMatch) {
        currentDay = {
          id: `day-${dayMatch[1]}`,
          title: line.slice(3).trim(),
          description: '',
          destinations: []
        };
        currentDestination = null;
        currentSection = 'day';
      }
      continue;
    }

    // Destination header (###)
    if (line.startsWith('### ') && currentDay) {
      // Save previous destination
      if (currentDestination) {
        currentDay.destinations.push(currentDestination);
      }

      const destName = line.slice(4).trim();
      currentDestination = {
        id: generateId(destName),
        name: destName,
        steps: [],
        tips: [],
        foodRecommendations: []
      };
      currentSection = 'destination';
      continue;
    }

    // Cost Breakdown
    if (line.startsWith('## Cost Breakdown')) {
      if (currentDay) {
        if (currentDestination) {
          currentDay.destinations.push(currentDestination);
          currentDestination = null;
        }
        result.days.push(currentDay);
        currentDay = null;
      }
      currentSection = 'cost';
      continue;
    }

    // Handle content based on section
    switch (currentSection) {
      case 'intro':
        if (line.startsWith('##')) {
          // End of intro, this will be handled in the next iteration
        } else if (line.trim()) {
          introLines.push(line.trim());
        }
        break;

      case 'day':
        if (line.trim() && !line.startsWith('###') && !line.startsWith('##')) {
          if (currentDay) {
            currentDay.description += (currentDay.description ? ' ' : '') + line.trim();
          }
        }
        break;

      case 'destination':
        if (line.startsWith('### Tips')) {
          currentSection = 'tips';
        } else if (line.startsWith('### Food Recommendations')) {
          currentSection = 'food';
        } else if (line.startsWith('- ')) {
          const { icon, time, content } = extractTimeAndIcon(line);
          if (currentDestination) {
            currentDestination.steps.push({
              id: `${currentDestination.id}-step-${currentDestination.steps.length}`,
              time,
              icon,
              content
            });
          }
        }
        break;

      case 'tips':
        if (line.startsWith('### Food Recommendations')) {
          currentSection = 'food';
        } else if (line.startsWith('### ') && currentDestination) {
          // New destination
          currentDestination.tips = currentDestination.tips || [];
          currentDay?.destinations.push(currentDestination);
          const destName = line.slice(4).trim();
          currentDestination = {
            id: generateId(destName),
            name: destName,
            steps: [],
            tips: [],
            foodRecommendations: []
          };
          currentSection = 'destination';
        } else if (line.startsWith('## ')) {
          // New day or section
          if (currentDestination && currentDay) {
            currentDay.destinations.push(currentDestination);
          }
          if (currentDay) {
            result.days.push(currentDay);
          }
          currentDestination = null;
          currentDay = null;
          
          if (line.startsWith('## Day ')) {
            const dayMatch = line.match(/## Day (\d+):?\s*(.*)/);
            if (dayMatch) {
              currentDay = {
                id: `day-${dayMatch[1]}`,
                title: line.slice(3).trim(),
                description: '',
                destinations: []
              };
              currentSection = 'day';
            }
          } else if (line.startsWith('## Cost Breakdown')) {
            currentSection = 'cost';
          }
        } else if (line.startsWith('- ') && currentDestination) {
          currentDestination.tips = currentDestination.tips || [];
          currentDestination.tips.push(line.slice(2).trim());
        }
        break;

      case 'food':
        if (line.startsWith('### Tips')) {
          currentSection = 'tips';
        } else if (line.startsWith('### ') && currentDestination) {
          // New destination
          currentDestination.foodRecommendations = currentDestination.foodRecommendations || [];
          currentDay?.destinations.push(currentDestination);
          const destName = line.slice(4).trim();
          currentDestination = {
            id: generateId(destName),
            name: destName,
            steps: [],
            tips: [],
            foodRecommendations: []
          };
          currentSection = 'destination';
        } else if (line.startsWith('## ')) {
          // New day or section
          if (currentDestination && currentDay) {
            currentDay.destinations.push(currentDestination);
          }
          if (currentDay) {
            result.days.push(currentDay);
          }
          currentDestination = null;
          currentDay = null;
          
          if (line.startsWith('## Day ')) {
            const dayMatch = line.match(/## Day (\d+):?\s*(.*)/);
            if (dayMatch) {
              currentDay = {
                id: `day-${dayMatch[1]}`,
                title: line.slice(3).trim(),
                description: '',
                destinations: []
              };
              currentSection = 'day';
            }
          } else if (line.startsWith('## Cost Breakdown')) {
            currentSection = 'cost';
          }
        } else if (line.startsWith('- ') && currentDestination) {
          currentDestination.foodRecommendations = currentDestination.foodRecommendations || [];
          currentDestination.foodRecommendations.push(line.slice(2).trim());
        }
        break;

      case 'cost':
        if (line.startsWith('- ')) {
          result.costBreakdown.push(line.slice(2).trim());
        } else if (!line.startsWith('-') && line.trim() && !line.startsWith('##')) {
          // Outro text after cost breakdown
          outroLines.push(line.trim());
          currentSection = 'outro';
        }
        break;

      case 'outro':
        if (line.trim()) {
          outroLines.push(line.trim());
        }
        break;
    }
  }

  // Save final state
  if (currentDay) {
    if (currentDestination) {
      currentDay.destinations.push(currentDestination);
    }
    result.days.push(currentDay);
  }

  result.intro = introLines.join(' ');
  result.outro = outroLines.join(' ');

  return result;
}
