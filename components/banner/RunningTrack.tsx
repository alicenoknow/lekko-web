import React from 'react';

const RunningTrack: React.FC = () => {
    const lanes = [
        { left: '0%', rotateX: '72deg' },
        { left: '20%', rotateX: '70deg' },
        { left: '40%', rotateX: '68deg' },
        { left: '60%', rotateX: '68deg' },
        { left: '80%', rotateX: '70deg' },
        { left: '100%', rotateX: '72deg' },
    ];

    return (
        <div style={trackStyle}>
            {lanes.map((lane, index) => (
                <div
                    key={index}
                    style={{
                        ...laneStyle,
                        left: lane.left,
                        transform: `rotateX(${lane.rotateX})`,
                    }}
                />
            ))}
        </div>
    );
};

const trackStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, #8587EA 25%, #edf4f8 65%)',
    perspective: 700,
    overflow: 'hidden',
    transformStyle: 'preserve-3d',
    zIndex: 0,
};

const laneStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    height: '500%',
    width: '20px',
    background:
        'linear-gradient(to top, white 0%, transparent 50%, transparent 100%)',
    transformOrigin: 'bottom center',
};

export default RunningTrack;
