import { z } from 'zod';

export const GeneratePlaylistDto = z.object({
  playlistName: z
    .string()
    .min(1)
    .describe('The name of the playlist to be created.'),
  limit: z
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .describe(
      'The target number of tracks to recommend. Default: 20. Min: 1. Max: 100.',
    ),
  market: z
    .string()
    .optional()
    .describe(
      'An ISO 3166-1 alpha-2 country code to filter recommendations by market.',
    ),
  seed_artists: z
    .array(z.string())
    .max(5)
    .optional()
    .describe(
      'A list of artist names to use as seeds for recommendations. Max: 5.',
    ),
  seed_genres: z
    .array(z.string())
    .max(5)
    .optional()
    .describe(
      'A list of genres to use as seeds for recommendations. Max: 5. Examples: ["acoustic", "afrobeat", "alt-rock", "alternative", "ambient", "anime", "black-metal", "bluegrass", "blues", "bossanova", "brazil", "breakbeat", "british", "cantopop", "chicago-house", "children", "chill", "classical", "club", "comedy", "country", "dance", "dancehall", "death-metal", "deep-house", "detroit-techno", "disco", "disney", "drum-and-bass", "dub", "dubstep", "edm", "electro", "electronic", "emo", "folk", "forro", "french", "funk", "garage", "german", "gospel", "goth", "grindcore", "groove", "grunge", "guitar", "happy", "hard-rock", "hardcore", "hardstyle", "heavy-metal", "hip-hop", "holidays", "honky-tonk", "house", "idm", "indian", "indie", "indie-pop", "industrial", "iranian", "j-dance", "j-idol", "j-pop", "j-rock", "jazz", "k-pop", "kids", "latin", "latino", "malay", "mandopop", "metal", "metal-misc", "metalcore", "minimal-techno", "movies", "mpb", "new-age", "new-release", "opera", "pagode", "party", "philippines-opm", "piano", "pop", "pop-film", "post-dubstep", "power-pop", "progressive-house", "psych-rock", "punk", "punk-rock", "r-n-b", "rainy-day", "reggae", "reggaeton", "road-trip", "rock", "rock-n-roll", "rockabilly", "romance", "sad", "salsa", "samba", "sertanejo", "show-tunes", "singer-songwriter", "ska", "sleep", "songwriter", "soul", "soundtracks", "spanish", "study", "summer", "swedish", "synth-pop", "tango", "techno", "trance", "trip-hop", "turkish", "work-out", "world-music"]',
    ),
  seed_tracks: z
    .array(z.string())
    .max(5)
    .optional()
    .describe(
      'A list of track names to use as seeds for recommendations. Max: 5.',
    ),

  // // Acousticness
  // min_acousticness: z
  //   .number()
  //   .min(0)
  //   .max(1)
  //   .optional()
  //   .describe('The minimum acousticness value. Range: 0.0 to 1.0'),
  // max_acousticness: z
  //   .number()
  //   .min(0)
  //   .max(1)
  //   .optional()
  //   .describe('The maximum acousticness value. Range: 0.0 to 1.0'),
  target_acousticness: z
    .number()
    .min(0)
    .max(1)
    .optional()
    .describe('The target acousticness value. Range: 0.0 to 1.0'),

  // // Danceability
  // min_danceability: z
  //   .number()
  //   .min(0)
  //   .max(1)
  //   .optional()
  //   .describe('The minimum danceability value. Range: 0.0 to 1.0'),
  // max_danceability: z
  //   .number()
  //   .min(0)
  //   .max(1)
  //   .optional()
  //   .describe('The maximum danceability value. Range: 0.0 to 1.0'),
  target_danceability: z
    .number()
    .min(0)
    .max(1)
    .optional()
    .describe('The target danceability value. Range: 0.0 to 1.0'),

  // // Duration (in milliseconds)
  // min_duration_ms: z
  //   .number()
  //   .int()
  //   .min(0)
  //   .optional()
  //   .describe('The minimum duration of the track in milliseconds.'),
  // max_duration_ms: z
  //   .number()
  //   .int()
  //   .min(0)
  //   .optional()
  //   .describe('The maximum duration of the track in milliseconds.'),
  target_duration_ms: z
    .number()
    .int()
    .min(0)
    .optional()
    .describe('The target duration of the track in milliseconds.'),

  // // Energy
  // min_energy: z
  //   .number()
  //   .min(0)
  //   .max(1)
  //   .optional()
  //   .describe('The minimum energy value. Range: 0.0 to 1.0'),
  // max_energy: z
  //   .number()
  //   .min(0)
  //   .max(1)
  //   .optional()
  //   .describe('The maximum energy value. Range: 0.0 to 1.0'),
  target_energy: z
    .number()
    .min(0)
    .max(1)
    .optional()
    .describe('The target energy value. Range: 0.0 to 1.0'),

  // // Instrumentalness
  // min_instrumentalness: z
  //   .number()
  //   .min(0)
  //   .max(1)
  //   .optional()
  //   .describe('The minimum instrumentalness value. Range: 0.0 to 1.0'),
  // max_instrumentalness: z
  //   .number()
  //   .min(0)
  //   .max(1)
  //   .optional()
  //   .describe('The maximum instrumentalness value. Range: 0.0 to 1.0'),
  target_instrumentalness: z
    .number()
    .min(0)
    .max(1)
    .optional()
    .describe('The target instrumentalness value. Range: 0.0 to 1.0'),

  // // Key (standard Pitch Class notation)
  // min_key: z
  //   .number()
  //   .int()
  //   .min(0)
  //   .max(11)
  //   .optional()
  //   .describe('The minimum key value. Range: 0 to 11'),
  // max_key: z
  //   .number()
  //   .int()
  //   .min(0)
  //   .max(11)
  //   .optional()
  //   .describe('The maximum key value. Range: 0 to 11'),
  target_key: z
    .number()
    .int()
    .min(0)
    .max(11)
    .optional()
    .describe('The target key value. Range: 0 to 11'),

  // // Liveness
  // min_liveness: z
  //   .number()
  //   .min(0)
  //   .max(1)
  //   .optional()
  //   .describe('The minimum liveness value. Range: 0.0 to 1.0'),
  // max_liveness: z
  //   .number()
  //   .min(0)
  //   .max(1)
  //   .optional()
  //   .describe('The maximum liveness value. Range: 0.0 to 1.0'),
  target_liveness: z
    .number()
    .min(0)
    .max(1)
    .optional()
    .describe('The target liveness value. Range: 0.0 to 1.0'),

  // // Loudness (dB)
  // min_loudness: z
  //   .number()
  //   .optional()
  //   .describe('The minimum loudness value in decibels.'),
  // max_loudness: z
  //   .number()
  //   .optional()
  //   .describe('The maximum loudness value in decibels.'),
  // target_loudness: z
  //   .number()
  //   .optional()
  //   .describe('The target loudness value in decibels.'),

  // // Mode (0 = minor, 1 = major)
  // min_mode: z
  //   .number()
  //   .int()
  //   .min(0)
  //   .max(1)
  //   .optional()
  //   .describe('The minimum mode value. 0 for minor, 1 for major.'),
  // max_mode: z
  //   .number()
  //   .int()
  //   .min(0)
  //   .max(1)
  //   .optional()
  //   .describe('The maximum mode value. 0 for minor, 1 for major.'),
  target_mode: z
    .number()
    .int()
    .min(0)
    .max(1)
    .optional()
    .describe('The target mode value. 0 for minor, 1 for major.'),

  // // Popularity
  // min_popularity: z
  //   .number()
  //   .int()
  //   .min(0)
  //   .max(100)
  //   .optional()
  //   .describe('The minimum popularity value. Range: 0 to 100'),
  // max_popularity: z
  //   .number()
  //   .int()
  //   .min(0)
  //   .max(100)
  //   .optional()
  //   .describe('The maximum popularity value. Range: 0 to 100'),
  // target_popularity: z
  //   .number()
  //   .int()
  //   .min(0)
  //   .max(100)
  //   .optional()
  //   .describe('The target popularity value. Range: 0 to 100'),

  // // Speechiness
  // min_speechiness: z
  //   .number()
  //   .min(0)
  //   .max(1)
  //   .optional()
  //   .describe('The minimum speechiness value. Range: 0.0 to 1.0'),
  // max_speechiness: z
  //   .number()
  //   .min(0)
  //   .max(1)
  //   .optional()
  //   .describe('The maximum speechiness value. Range: 0.0 to 1.0'),
  // target_speechiness: z
  //   .number()
  //   .min(0)
  //   .max(1)
  //   .optional()
  //   .describe('The target speechiness value. Range: 0.0 to 1.0'),

  // // Tempo (BPM)
  // min_tempo: z
  //   .number()
  //   .min(0)
  //   .optional()
  //   .describe('The minimum tempo value in beats per minute.'),
  // max_tempo: z
  //   .number()
  //   .min(0)
  //   .optional()
  //   .describe('The maximum tempo value in beats per minute.'),
  // target_tempo: z
  //   .number()
  //   .min(0)
  //   .optional()
  //   .describe('The target tempo value in beats per minute.'),

  // // Time Signature
  // min_time_signature: z
  //   .number()
  //   .int()
  //   .min(0)
  //   .optional()
  //   .describe('The minimum time signature value.'),
  // max_time_signature: z
  //   .number()
  //   .int()
  //   .min(0)
  //   .optional()
  //   .describe('The maximum time signature value.'),
  // target_time_signature: z
  //   .number()
  //   .int()
  //   .min(0)
  //   .optional()
  //   .describe('The target time signature value.'),

  // // Valence
  // min_valence: z
  //   .number()
  //   .min(0)
  //   .max(1)
  //   .optional()
  //   .describe('The minimum valence value. Range: 0.0 to 1.0'),
  // max_valence: z
  //   .number()
  //   .min(0)
  //   .max(1)
  //   .optional()
  //   .describe('The maximum valence value. Range: 0.0 to 1.0'),
  // target_valence: z
  //   .number()
  //   .min(0)
  //   .max(1)
  //   .optional()
  //   .describe('The target valence value. Range: 0.0 to 1.0'),
});

export type GeneratePlaylistDto = z.infer<typeof GeneratePlaylistDto>;
