import { apiClient } from '@/lib/api-client';

export interface Trip {
    id: string;
    name: string;
    departure_date: string;
    return_date: string;
    total_jamaah?: number;
    capacity: number;
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    price: number;
    destination: string;
    description?: string;
    package_type?: string;
    organizer?: string;
    airline?: string;
    hotel_rating?: number;
    inclusions?: string;
    exclusions?: string;
    itinerary?: string;
    images?: string;
    contact_person?: string;
    contact_phone?: string;
    notes?: string;
}

export interface TripStats {
    total_trips: number;
    total_jamaah?: number;
    active_trips: number;
    average_per_trip?: number;
    upcoming_trips?: number;
    ongoing_trips?: number;
    completed_trips?: number;
}

export interface CreateTripData {
    name: string;
    description?: string;
    destination: string;
    departure_date: string;
    return_date: string;
    capacity: number;
    price: number;
    status?: string;
    package_type?: string;
    organizer?: string;
    airline?: string;
    hotel_rating?: number;
    inclusions?: string;
    exclusions?: string;
    itinerary?: string;
    images?: string;
    contact_person?: string;
    contact_phone?: string;
    notes?: string;
}

export interface UpdateTripData extends Partial<CreateTripData> {
    is_active?: boolean;
}

class TripsService {
    /**
     * Get all trips from backend
     */
    async getAll(): Promise<Trip[]> {
        try {
            const response = await apiClient.get('/trip');
            const trips = response.data;

            // Convert price from string to number for all trips
            return trips.map((trip: any) => ({
                ...trip,
                price: typeof trip.price === 'string' ? parseFloat(trip.price) : trip.price
            }));
        } catch (error) {
            console.error('Failed to fetch trips:', error);
            return [];
        }
    }

    /**
     * Get trip by ID
     */
    async getById(id: string): Promise<Trip> {
        const response = await apiClient.get(`/trip/${id}`);
        const trip = response.data;

        // Convert price from string to number if needed
        if (typeof trip.price === 'string') {
            trip.price = parseFloat(trip.price);
        }

        return trip;
    }

    /**
     * Create new trip
     */
    async create(data: CreateTripData): Promise<Trip> {
        const response = await apiClient.post('/trip', data);
        return response.data;
    }

    /**
     * Update existing trip
     */
    async update(id: string, data: UpdateTripData): Promise<Trip> {
        const response = await apiClient.patch(`/trip/${id}`, data);
        return response.data;
    }

    /**
     * Delete trip (soft delete)
     */
    async delete(id: string): Promise<void> {
        await apiClient.delete(`/trip/${id}`);
    }

    /**
     * Get trip statistics
     */
    async getStats(): Promise<TripStats> {
        try {
            const response = await apiClient.get('/trip/stats');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch trip stats:', error);
            return {
                total_trips: 0,
                active_trips: 0,
                upcoming_trips: 0,
                ongoing_trips: 0,
                completed_trips: 0,
            };
        }
    }
}

export const tripsService = new TripsService();
