export function createParticleData(count: number, spread: number, speed: number) {
  const positions = new Float32Array(count * 3)
  const velocities = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const palette = [[0, 1, 0.9], [1, 0.84, 0.37], [0.8, 0.8, 0.9]]

  for (let i = 0; i < count; i++) {
    const offset = i * 3
    const color = palette[Math.floor(Math.random() * palette.length)]
    for (let axis = 0; axis < 3; axis++) {
      positions[offset + axis] = (Math.random() - 0.5) * spread
      velocities[offset + axis] = (Math.random() - 0.5) * speed
      colors[offset + axis] = color[axis]
    }
  }

  return { positions, velocities, colors }
}
