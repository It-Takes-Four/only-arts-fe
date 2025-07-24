import React, { useEffect, useRef } from 'react';

interface Node {
	x: number;
	y: number;
	vx: number;
	vy: number;
	connections: number[];
	activity: number;
}

export const NeuralNetwork: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const nodesRef = useRef<Node[]>([]);
	const animationRef = useRef<number>(0);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const resizeCanvas = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			createNetwork();
		};

		const createNetwork = () => {
			const nodes: Node[] = [];
			const nodeCount = Math.floor((canvas.width * canvas.height) / 25000);

			// Create nodes
			for (let i = 0; i < nodeCount; i++) {
				nodes.push({
					x: Math.random() * canvas.width,
					y: Math.random() * canvas.height,
					vx: (Math.random() - 0.5) * 0.3,
					vy: (Math.random() - 0.5) * 0.3,
					connections: [],
					activity: Math.random(),
				});
			}

			// Create connections
			nodes.forEach((node, i) => {
				const connectionCount = Math.floor(Math.random() * 4) + 2;
				for (let j = 0; j < connectionCount; j++) {
					const targetIndex = Math.floor(Math.random() * nodes.length);
					if (targetIndex !== i && !node.connections.includes(targetIndex)) {
						node.connections.push(targetIndex);
					}
				}
			});

			nodesRef.current = nodes;
		};

		let time = 0;

		const animate = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Background gradient
			const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
			gradient.addColorStop(0, '#0a0a0a');
			gradient.addColorStop(0.5, '#1a1a2e');
			gradient.addColorStop(1, '#16213e');
			ctx.fillStyle = gradient;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			const nodes = nodesRef.current;

			// Update nodes
			nodes.forEach((node) => {
				node.x += node.vx;
				node.y += node.vy;

				// Bounce off edges
				if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
				if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

				// Update activity
				node.activity = Math.sin(time * 0.002 + node.x * 0.01 + node.y * 0.01) * 0.5 + 0.5;
			});

			// Draw connections
			nodes.forEach((node, i) => {
				node.connections.forEach((connectionIndex) => {
					const target = nodes[connectionIndex];
					if (!target) return;

					const distance = Math.sqrt(
						Math.pow(node.x - target.x, 2) + Math.pow(node.y - target.y, 2)
					);

					if (distance < 200) {
						const activity = (node.activity + target.activity) / 2;
						const opacity = activity * (1 - distance / 200) * 0.3;

						// Animated pulse along connection
						const pulsePosition = (time * 0.001 + i * 0.1) % 1;
						const pulseX = node.x + (target.x - node.x) * pulsePosition;
						const pulseY = node.y + (target.y - node.y) * pulsePosition;

						// Draw connection line
						ctx.beginPath();
						ctx.moveTo(node.x, node.y);
						ctx.lineTo(target.x, target.y);
						ctx.strokeStyle = `rgba(140, 92, 255, ${opacity})`;
						ctx.lineWidth = 1;
						ctx.stroke();

						// Draw pulse
						ctx.beginPath();
						ctx.arc(pulseX, pulseY, 2, 0, Math.PI * 2);
						ctx.fillStyle = `rgba(255, 107, 157, ${activity * 0.5})`;
						ctx.fill();
					}
				});
			});

			// Draw nodes
			nodes.forEach((node) => {
				const size = 2 + node.activity * 3;

				// Node glow
				const glowGradient = ctx.createRadialGradient(
					node.x, node.y, 0,
					node.x, node.y, size * 3
				);
				glowGradient.addColorStop(0, `rgba(140, 92, 255, ${node.activity * 0.5})`);
				glowGradient.addColorStop(1, 'rgba(140, 92, 255, 0)');

				ctx.beginPath();
				ctx.arc(node.x, node.y, size * 3, 0, Math.PI * 2);
				ctx.fillStyle = glowGradient;
				ctx.fill();

				// Node core
				ctx.beginPath();
				ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + node.activity * 0.7})`;
				ctx.fill();
			});

			time += 16;
			animationRef.current = requestAnimationFrame(animate);
		};

		resizeCanvas();
		animate();

		const handleResize = () => {
			resizeCanvas();
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			className="fixed inset-0 pointer-events-none z-0"
		/>
	);
};