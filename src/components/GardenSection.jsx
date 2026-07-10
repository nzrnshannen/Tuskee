import React from 'react';
import { PixelSprout, getVegetableComponent } from './PixelIcons';

export default function GardenSection({ todos }) {
  const totalTasks = todos.length;
  const completedTasks = todos.filter(t => t.completed).length;
  const growthRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Let's create a fixed 16-slot grid (4x4)
  const totalSlots = 16;

  const renderSlots = () => {
    const slots = [];

    for (let i = 0; i < totalSlots; i++) {
      if (i < totalTasks) {
        // This slot is bound to an active task
        const todo = todos[i];
        if (todo.completed) {
          // Render fully grown vegetable
          const VegetableComponent = getVegetableComponent(i);
          slots.push(
            <div key={i} className="soil-slot" title={`Completed: "${todo.text}"`}>
              <VegetableComponent className="plant-pop plant-sway" />
            </div>
          );
        } else {
          // Render a sprout
          slots.push(
            <div key={i} className="soil-slot" title={`Sprouted: "${todo.text}"`}>
              <PixelSprout className="plant-pop plant-sway" />
            </div>
          );
        }
      } else {
        // Empty slot, render grass patch
        slots.push(
          <div key={i} className="soil-slot grass" title="Empty plot (Add tasks to plant)" />
        );
      }
    }

    return slots;
  };

  return (
    <div className="pixel-wood-panel garden-panel">
      {/* Title */}
      <h2 className="panel-title">
        ✨ CELESTIAL GARDEN
      </h2>

      {/* Progress & Growth Stats */}
      <div className="garden-status-bar">
        <span>GROWTH: {growthRate}%</span>
        <span>{completedTasks} / {totalTasks} CHARGED</span>
      </div>

      {/* Grid Container */}
      <div className="garden-plot">
        {renderSlots()}
      </div>

      {/* Footer Info */}
      <div style={{ marginTop: '12px', textAlign: 'center' }}>
        <p className="pixel-text" style={{ fontSize: '0.5rem', color: 'var(--diary-lines)', textShadow: '1px 1px 0 var(--outline-dark)', lineHeight: '1.4' }}>
          {totalTasks === 0 ? (
            "CELESTIAL PLOT IS EMPTY. CAST TASKS TO PLANT STAR SEEDS."
          ) : completedTasks === totalTasks ? (
            "🌟 MAGICAL POWER AWAKENED! ALL ITEMS ARE FULLY CHARGED! 🌟"
          ) : (
            "COMPLETE PLANS ON THE LEFT BOARD TO GROW MAGICAL CROPS."
          )}
        </p>
      </div>
    </div>
  );
}
