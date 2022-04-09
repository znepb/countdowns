import React, { Component } from "react";
import { CreateTypes } from "canvas-confetti";

function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export default class Fireworks extends Component {
  private isAnimationEnabled: boolean;
  private animationInstance: CreateTypes | null = null;
  private intervalId: NodeJS.Timeout | null = null;

  constructor(props: {}) {
    super(props);
    this.isAnimationEnabled = false;
  }

  getAnimationSettings(originXA: number, originXB: number) {
    return {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 0,
      particleCount: 150,
      origin: {
        x: randomInRange(originXA, originXB),
        y: Math.random() - 0.2,
      },
    };
  }

  nextTickAnimation = () => {
    this.animationInstance &&
      this.animationInstance(this.getAnimationSettings(0, 1));
  };

  startAnimation() {
    if (!this.isAnimationEnabled) {
      this.isAnimationEnabled = true;
      this.intervalId = setInterval(this.nextTickAnimation, 400);
    }
  }

  pauseAnimation() {
    this.isAnimationEnabled = false;
    return this.intervalId && clearInterval(this.intervalId);
  }

  stopAnimation() {
    this.isAnimationEnabled = false;
    this.animationInstance && this.animationInstance.reset();
    return this.intervalId && clearInterval(this.intervalId);
  }

  componentWillUnmount() {
    this.isAnimationEnabled = false;
    this.intervalId && clearInterval(this.intervalId);
  }

  getInstance = (instance: CreateTypes | null) => {
    this.animationInstance = instance;
  };
}
