import React from 'react';

const MusicList = ({ musicData }) => {
  return (
    <div>
      {musicData.tracks.items.map((track) => (
        <div key={track.id} style={{ marginBottom: '20px' }}>
          <h3>{track.name}</h3>
          <p>{track.artists.map((artist) => artist.name).join(', ')}</p>
          {track.preview_url ? (
            <audio controls>
              <source src={track.preview_url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          ) : (
            <p>No preview available</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default MusicList;
