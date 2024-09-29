export function extractFeaturesPrompt(transcript: string): string {
  return `
Please analyze the following conversation transcript between **Moodify** and a user. Moodify is an AI-powered music companion dedicated to creating the perfect playlist for users based on their mood and daily activities.

**Conversation Transcript:**

${transcript}

Based on the conversation, extract the necessary information to fill in the following fields for creating a personalized playlist:

1. **playlistName**: The name of the playlist to be created.
2. **limit**: The target number of tracks to recommend (Default: 20, Min: 1, Max: 100).
3. **market**: An ISO 3166-1 alpha-2 country code to filter recommendations by market.
4. **seed_artists**: A list of artist names to use as seeds for recommendations (Max: 5).
5. **seed_genres**: A list of genres to use as seeds for recommendations (Max: 5).
6. **seed_tracks**: A list of track names to use as seeds for recommendations (Max: 5).
7. **Acoustic Features**: Provide "min", "max", and "target" values for the following features based on the user's preferences and mood:
   - **acousticness** (Range: 0.0 to 1.0)
   - **danceability** (Range: 0.0 to 1.0)
   - **duration_ms** (Values in milliseconds)
   - **energy** (Range: 0.0 to 1.0)
   - **instrumentalness** (Range: 0.0 to 1.0)
   - **key** (Integer values from 0 to 11)
   - **liveness** (Range: 0.0 to 1.0)
   - **loudness** (Values in decibels, typically between -60.0 and 0.0)
   - **mode** (0 for minor, 1 for major)
   - **popularity** (Integer values from 0 to 100)
   - **speechiness** (Range: 0.0 to 1.0)
   - **tempo** (Values in beats per minute)
   - **time_signature** (Integer values, typically between 3 and 7)
   - **valence** (Range: 0.0 to 1.0)

Provide your analysis **strictly** in the following JSON format without any additional text or explanations:

\`\`\`json
{
  "playlistName": "string",
  "limit": number,
  "market": "string",
  "seed_artists": ["artist1", "artist2"],
  "seed_genres": ["genre1", "genre2"],
  "seed_tracks": ["track1", "track2"],
  "min_acousticness": 0.0,
  "max_acousticness": 1.0,
  "target_acousticness": 0.5,
  "min_danceability": 0.0,
  "max_danceability": 1.0,
  "target_danceability": 0.5,
  "min_duration_ms": 60000,
  "max_duration_ms": 480000,
  "target_duration_ms": 240000,
  "min_energy": 0.0,
  "max_energy": 1.0,
  "target_energy": 0.5,
  "min_instrumentalness": 0.0,
  "max_instrumentalness": 1.0,
  "target_instrumentalness": 0.5,
  "min_key": 0,
  "max_key": 11,
  "target_key": 5,
  "min_liveness": 0.0,
  "max_liveness": 1.0,
  "target_liveness": 0.5,
  "min_loudness": -60.0,
  "max_loudness": 0.0,
  "target_loudness": -30.0,
  "min_mode": 0,
  "max_mode": 1,
  "target_mode": 1,
  "min_popularity": 0,
  "max_popularity": 100,
  "target_popularity": 50,
  "min_speechiness": 0.0,
  "max_speechiness": 1.0,
  "target_speechiness": 0.5,
  "min_tempo": 0.0,
  "max_tempo": 250.0,
  "target_tempo": 120.0,
  "min_time_signature": 3,
  "max_time_signature": 7,
  "target_time_signature": 4,
  "min_valence": 0.0,
  "max_valence": 1.0,
  "target_valence": 0.5
}
\`\`\`

**Important guidelines:**
- Only output the JSON object in the format shown above. Do not include any additional text or explanations.
- Ensure all fields are included and properly formatted.
- Use decimal points for floating-point numbers (e.g., 0.5, -30.0).
- Ensure the JSON is valid and can be parsed by \`JSON.parse()\`.
- If any field is not applicable or information is not available from the conversation, you may omit it or set it to \`null\`.
`;
}
