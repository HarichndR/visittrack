"use client";

import axios from 'axios';

type LogLevel = 'info' | 'warn' | 'error';

interface LogPayload {
  level: LogLevel;
  message: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
  url: string;
  userAgent: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

class Telemetry {
  private static instance: Telemetry;
  private isInitialized = false;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  public static getInstance(): Telemetry {
    if (!Telemetry.instance) {
      Telemetry.instance = new Telemetry();
    }
    return Telemetry.instance;
  }

  private init() {
    if (this.isInitialized) return;

    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.error('Unhandled Promise Rejection', {
        reason: String(event.reason),
      });
    });

    // Capture global errors
    window.addEventListener('error', (event) => {
      this.error('Global Window Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack,
      });
    });

    this.isInitialized = true;
  }

  private async sendToBackend(level: LogLevel, message: string, metadata?: Record<string, unknown>) {
    const payload: LogPayload = {
      level,
      message,
      metadata,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'SSR',
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'Server',
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      const color = level === 'error' ? 'color: #ff0000' : level === 'warn' ? 'color: #ffa500' : 'color: #00ff00';
      console.log(`%c[Telemetry:${level.toUpperCase()}]`, color, message, metadata);
    }

    try {
      // Use axios directly to avoid circular dependencies with services/api
      await axios.post(`${API_BASE_URL}/logs/telemetry`, payload);
    } catch (err) {
      // Fallback if backend logging fails - avoid infinite loop
      if (process.env.NODE_ENV === 'development') {
        console.error('Telemetry failed to send log to backend:', err);
      }
    }
  }

  public info(message: string, metadata?: Record<string, unknown>) {
    this.sendToBackend('info', message, metadata);
  }

  public warn(message: string, metadata?: Record<string, unknown>) {
    this.sendToBackend('warn', message, metadata);
  }

  public error(message: string, metadata?: Record<string, unknown>) {
    this.sendToBackend('error', message, metadata);
  }
}

export const telemetry = Telemetry.getInstance();
