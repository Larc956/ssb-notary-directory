import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Clock, Phone, Mail, Globe, MapPin, CheckCircle2, Wallet } from "lucide-react";
import type { CoreLocation } from "@/lib/types/location";

type LocationDetailSheetProps = {
  location: CoreLocation | null;
  onClose: () => void;
};

export function LocationDetailSheet({ location, onClose }: LocationDetailSheetProps) {
  // If no location is selected, the sheet will be hidden
  if (!location) return null;

  return (
    <Sheet open={!!location} onOpenChange={(isOpen) => !isOpen && onClose()}>
      {/* sm:max-w-md keeps it a nice sidebar on desktop, and full screen on mobile */}
      <SheetContent className="overflow-y-auto sm:max-w-md w-full bg-white">
        <SheetHeader className="text-left space-y-1 pb-4 border-b border-slate-100 mt-4">
          <SheetTitle className="text-2xl font-bold text-blue-950">
            {location.name}
          </SheetTitle>
          {location.branch_name && (
            <SheetDescription className="font-medium text-slate-500">
              {location.branch_name}
            </SheetDescription>
          )}
          <div className="flex flex-wrap gap-2 pt-3">
            {location.offers_walk_in && <Badge variant="secondary">Walk-in OK</Badge>}
            {location.offers_online && <Badge variant="secondary">Online Services</Badge>}
            {location.student_discount_available && (
              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-none">
                Student Discount
              </Badge>
            )}
          </div>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Location Section */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Location</h3>
            <div className="flex items-start gap-3 text-slate-600 text-sm">
              <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <p>{location.raw_address}</p>
                {location.raw_landmarks && (
                  <p className="text-slate-500 text-xs mt-1 italic">
                    Landmark: {location.raw_landmarks}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Contact & Hours Section */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Hours & Contact</h3>
            <div className="space-y-2 text-sm text-slate-600">
              {location.office_hours_text && (
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{location.office_hours_text}</span>
                </div>
              )}
              {location.contact_numbers_text && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{location.contact_numbers_text}</span>
                </div>
              )}
              {location.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>{location.email}</span>
                </div>
              )}
              {location.facebook_page && (
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <a href={`https://${location.facebook_page}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                    {location.facebook_page}
                  </a>
                </div>
              )}
            </div>
          </section>

          {/* Fees & Payment Section */}
          <section className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-600" />
              Fees & Payment
            </h3>
            
            {location.standard_fee_text && (
              <p className="text-sm text-slate-700">
                <span className="font-medium">Standard Fee:</span> {location.standard_fee_text}
              </p>
            )}

            <div className="pt-2">
              <p className="text-xs text-slate-500 mb-2">Accepted Payment Methods:</p>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-700">
                {location.accepts_cash && (
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Cash</div>
                )}
                {location.accepts_gcash && (
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-blue-500" /> GCash</div>
                )}
                {location.accepts_bank_transfer && (
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Bank Transfer</div>
                )}
              </div>
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}