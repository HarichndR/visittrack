"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { useAuth } from "@/store/use-auth";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Loader2, 
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePagination } from "@/hooks/use-pagination";
import { useDebounce } from "@/hooks/use-debounce";
import { FilterBar } from "@/components/common/filter-bar";
import { PaginationControl } from "@/components/common/pagination-control";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { toast } from "sonner";
import { EventCard } from "@/components/events/event-card";
import { RegistrationModal } from "@/components/events/registration-modal";
import { CreateEventDialog } from "@/components/events/create-event-dialog";
import { StallRequestModal } from "@/components/modals/stall-request-modal";
import { Event } from "@/types";



export default function EventsPage() {
  const [search, setSearch] = useState("");
  const [bookingEvent, setBookingEvent] = useState<Event | null>(null);
  const [stallRequestEvent, setStallRequestEvent] = useState<Event | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showStallSuccess, setShowStallSuccess] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    host: "",
    banner: "",
    autoApproval: true
  });
  
  const debouncedSearch = useDebounce(search, 500);
  const { page, limit, goToPage } = usePagination(1, 9);
  const queryClient = useQueryClient();
  const { user, updateUser } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['events', debouncedSearch, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(debouncedSearch && { search: debouncedSearch }),
      });
      const response = await api.get(`/events?${params.toString()}`);
      return response.data.data;
    },
  });

  const createEventMutation = useMutation({
    mutationFn: async (data: typeof newEvent) => {
      const response = await api.post('/events', data);
      return response.data;
    },
    onSuccess: () => {
      setShowCreateModal(false);
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success("Event Created", {
        description: "The event is now published to the calendar."
      });
      setNewEvent({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        location: "",
        host: "",
        banner: "",
        autoApproval: true
      });
    },
    onError: (err: any) => {
      toast.error("Failed to Create Event", {
        description: err.response?.data?.message || "Please check your input and try again."
      });
    }
  });

  const bookingMutation = useMutation({
    mutationFn: async ({ event, metadata }: { event: Event, metadata?: any }) => {
      const response = await api.post('/visitors', {
        name: user?.name,
        email: user?.email,
        phone: user?.phone || "0000000000",
        eventId: event._id,
        metadata
      });
      return response.data;
    },
    onSuccess: () => {
      setShowSuccess(true);
      setBookingEvent(null);
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      toast.success("Registration Successful", {
        description: "Your registration has been confirmed."
      });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Registration failed. Please contact support.";
      toast.error("Registration Error", {
        description: msg
      });
    }
  });

  const stallRequestMutation = useMutation({
    mutationFn: async ({ event, notes }: { event: Event, notes: string }) => {
      const response = await api.post('/stalls', {
        eventId: event._id,
        companyName: user?.businessName || user?.name || "Company",
        notes
      });
      return response.data;
    },
    onSuccess: () => {
      setShowStallSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['my-stall-bookings'] });
      toast.success("Request Submitted", {
        description: "The organizer has been notified of your interest."
      });
    },
    onError: (error: any) => {
      toast.error("Submission Failed", {
        description: error.response?.data?.message || "Could not submit request at this time."
      });
    }
  });

  const events = (data?.results as Event[]) || [];
  const totalPages = (data?.totalPages as number) || 0;
  const totalResults = (data?.totalResults as number) || 0;
  const isVisitor = user?.role === 'VISITOR';
  const savedEventIds = user?.savedEvents || [];

  const handleSaveToggle = async (eventId: string) => {
    try {
      const isSaved = savedEventIds.includes(eventId);
      const endpoint = isSaved ? `/users/unsave-event/${eventId}` : `/users/save-event/${eventId}`;
      const response = await api.post(endpoint);
      if (updateUser) updateUser(response.data.data);
    } catch (error) {
      console.error("Failed to toggle save:", error);
    }
  };

  return (
    <DashboardLayout isPublic>
      <div className="space-y-10 pb-20">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tighter text-slate-900 uppercase leading-none">Event Calendar</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-0.5">Explore and register for upcoming events</p>
          </div>
          {user?.role === 'ORGANIZER' && (
            <Button 
                onClick={() => setShowCreateModal(true)}
                className="h-12 bg-google-blue hover:bg-google-blue/90 text-white font-bold uppercase text-[10px] tracking-widest px-8 rounded-xl shadow-xl shadow-google-blue/20"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Event
            </Button>
          )}
        </header>

        <Card className="bg-white border border-slate-200/60 rounded-[3rem] shadow-premium p-10 overflow-hidden">
            <FilterBar 
              search={search}
              onSearchChange={setSearch}
              placeholder="Search events..."
            />
        </Card>

        {isLoading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[400px] w-full rounded-[3.5rem] bg-slate-50" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="h-96 flex flex-col items-center justify-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100 space-y-6">
            <div className="p-8 bg-slate-50 rounded-full border border-slate-100">
                <CalendarIcon className="h-16 w-16 text-slate-200" />
            </div>
            <div className="text-center space-y-2">
                <p className="text-xl font-bold uppercase tracking-tighter text-slate-400">No events found</p>
                <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Try adjusting your search filters.</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event: Event) => (
              <EventCard 
                key={event._id}
                event={event}
                isVisitor={isVisitor}
                user={user}
                isSaved={savedEventIds.includes(event._id)}
                onSaveToggle={handleSaveToggle}
                onRegister={(ev) => setBookingEvent(ev)}
                onStallRequest={(ev) => setStallRequestEvent(ev)}
                onManage={(id) => window.location.href = `/events/${id}/form`}
              />
            ))}
          </div>
        )}

        {events.length > 0 && (
          <div className="flex justify-center p-8 bg-white rounded-[3.5rem] border border-slate-100 shadow-premium">
              <PaginationControl 
                page={page}
                totalPages={totalPages}
                onPageChange={goToPage}
                totalResults={totalResults}
                limit={limit}
              />
          </div>
        )}
      </div>

      <RegistrationModal 
        event={bookingEvent}
        user={user}
        isOpen={!!bookingEvent}
        onClose={() => setBookingEvent(null)}
        onRegister={(metadata) => bookingMutation.mutate({ event: bookingEvent!, metadata })}
        isPending={bookingMutation.isPending}
        success={showSuccess}
        onSuccessClose={() => setShowSuccess(false)}
      />

      <StallRequestModal 
        event={stallRequestEvent}
        isOpen={!!stallRequestEvent}
        onClose={() => { setStallRequestEvent(null); setShowStallSuccess(false); }}
        onSubmit={(notes) => stallRequestMutation.mutate({ event: stallRequestEvent!, notes })}
        isPending={stallRequestMutation.isPending}
        success={showStallSuccess}
      />

      <CreateEventDialog 
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        isPending={createEventMutation.isPending}
        onSubmit={createEventMutation.mutate}
        eventData={newEvent}
        setEventData={setNewEvent}
      />
    </DashboardLayout>
  );
}
