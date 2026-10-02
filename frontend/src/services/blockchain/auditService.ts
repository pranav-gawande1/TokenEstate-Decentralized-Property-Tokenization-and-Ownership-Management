import type { AuditEvent, AuditEventType } from '../../types';
import { INITIAL_AUDIT_EVENTS } from '../mockData';

class AuditService {
  private events: AuditEvent[] = [...INITIAL_AUDIT_EVENTS];
  private listeners: Array<() => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('cadastra_audit_events');
      if (cached) {
        try {
          this.events = JSON.parse(cached);
        } catch (e) {
          console.error('Failed to parse cached audit events', e);
        }
      }
    }
  }

  private persist() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cadastra_audit_events', JSON.stringify(this.events));
    }
    this.listeners.forEach(l => l());
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  public recordEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): AuditEvent {
    const newEvent: AuditEvent = {
      ...event,
      id: `EVT-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString(),
    };
    this.events.unshift(newEvent);
    this.persist();
    return newEvent;
  }

  public getAllEvents(): AuditEvent[] {
    return [...this.events];
  }

  public getEventsByProperty(propertyId: string): AuditEvent[] {
    return this.events.filter(e => e.propertyId === propertyId);
  }

  public filterEvents(filters: {
    propertyId?: string;
    eventType?: AuditEventType | 'ALL';
    actorAddress?: string;
    searchTerm?: string;
  }): AuditEvent[] {
    return this.events.filter(e => {
      if (filters.propertyId && e.propertyId.toLowerCase() !== filters.propertyId.toLowerCase()) {
        return false;
      }
      if (filters.eventType && filters.eventType !== 'ALL' && e.eventType !== filters.eventType) {
        return false;
      }
      if (filters.actorAddress && !e.actorAddress.toLowerCase().includes(filters.actorAddress.toLowerCase())) {
        return false;
      }
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        const matches = 
          e.details.toLowerCase().includes(term) ||
          e.txHash.toLowerCase().includes(term) ||
          e.propertyId.toLowerCase().includes(term);
        if (!matches) return false;
      }
      return true;
    });
  }
}

export const auditService = new AuditService();
