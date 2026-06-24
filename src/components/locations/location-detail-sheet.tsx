import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Clock, Phone, Mail, Globe, MapPin, CheckCircle2, Wallet, MessageSquare, ShieldAlert, Percent } from "lucide-react";
import type { CoreLocation } from "@/lib/types/location";

type LocationDetailSheetProps = {
  location: CoreLocation | null;
  onClose: () => void;
};

export function LocationDetailSheet({ location, onClose }: LocationDetailSheetProps) {
  if (!location) return null;

  return (
    <Sheet open={!!location} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className="overflow-y-auto sm:max-w-md w-full bg-slate-50 p-0">
        <div className="bg-white p-6 pb-4 border-b border-[#003A6C]/10 mt-4">
          <SheetHeader className="text-left space-y-1">
            <SheetTitle className="text-2xl font-black text-[#003A6C] break-words">
              {location.display_name || location.name}
            </SheetTitle>
            {(location.raw_city || location.branch_name) && (
              <SheetDescription className="font-semibold text-[#003A6C]/60 break-words">
                {[location.branch_name, location.raw_city].filter(Boolean).join(" • ")}
              </SheetDescription>
            )}
            <div className="flex flex-wrap gap-2 pt-3">
              {location.offers_walk_in && <Badge variant="secondary" className="bg-[#003A6C]/5 text-[#003A6C] border border-[#003A6C]/20">Walk-in OK</Badge>}
              {location.offers_online && <Badge variant="secondary" className="bg-[#003A6C]/5 text-[#003A6C] border border-[#003A6C]/20">Online Svcs</Badge>}
              {(location.student_discount_fee_text || location.student_discount_available) && (
                <Badge className="bg-[#F2A900] text-[#003A6C] hover:bg-[#F2A900]/90 font-bold border-none whitespace-normal">
                  Student Discount
                </Badge>
              )}
            </div>
          </SheetHeader>
        </div>

        <div className="p-6 space-y-6">
          
          <section className="space-y-3">
            <h3 className="text-xs font-bold text-[#003A6C]/50 uppercase tracking-wider">Location</h3>
            <div className="flex items-start gap-3 text-slate-700 text-sm bg-white p-4 rounded-xl border border-[#003A6C]/10 shadow-sm">
              <MapPin className="w-5 h-5 text-[#F2A900] shrink-0 mt-0.5" />
              {/* Added min-w-0 and flex-1 here to force wrapping */}
              <div className="overflow-hidden break-words w-full">
                <p>{location.raw_address}</p>
                {location.raw_landmarks && (
                  <p className="text-slate-500 text-xs mt-1 italic">
                    Landmark: {location.raw_landmarks}
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-xs font-bold text-[#003A6C]/50 uppercase tracking-wider">Contact & Hours</h3>
            <div className="space-y-3 text-sm text-[#003A6C]/80 bg-white p-4 rounded-xl border border-[#003A6C]/10 shadow-sm break-words">
              {location.office_hours_text && (
                <div className="flex items-start gap-3"><Clock className="w-4 h-4 text-[#003A6C]/40 shrink-0 mt-0.5" /><span className="font-medium">{location.office_hours_text}</span></div>
              )}
              {location.contact_numbers_text && (
                <div className="flex items-start gap-3"><Phone className="w-4 h-4 text-[#003A6C]/40 shrink-0 mt-0.5" /><span className="font-medium">{location.contact_numbers_text}</span></div>
              )}
              {location.email && (
                <div className="flex items-start gap-3"><Mail className="w-4 h-4 text-[#003A6C]/40 shrink-0 mt-0.5" /><span className="font-medium break-all">{location.email}</span></div>
              )}
              {location.facebook_page && (
                <div className="flex items-start gap-3"><Globe className="w-4 h-4 text-[#003A6C]/40 shrink-0 mt-0.5" />
                  <a href={location.facebook_page.startsWith('http') ? location.facebook_page : `https://${location.facebook_page}`} target="_blank" rel="noreferrer" className="text-blue-600 font-medium hover:underline break-all">
                    {location.facebook_page}
                  </a>
                </div>
              )}
              {!location.office_hours_text && !location.contact_numbers_text && !location.email && !location.facebook_page && (
                <p className="text-[#003A6C]/40 italic text-xs">No contact details provided.</p>
              )}
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-xs font-bold text-[#003A6C]/50 uppercase tracking-wider">Fees & Payment</h3>
            <div className="bg-white p-4 rounded-xl border border-[#003A6C]/10 shadow-sm space-y-4 break-words">
              <div className="space-y-2">
                {location.standard_fee_text && (
                  <div className="flex gap-2 text-sm">
                    <Wallet className="w-4 h-4 text-[#003A6C] shrink-0 mt-0.5" />
                    <p className="text-[#003A6C]"><span className="font-bold">Standard Fee:</span> {location.standard_fee_text}</p>
                  </div>
                )}
                {location.fee_depends_on_copies && (
                  <p className="text-xs text-[#003A6C]/50 pl-6 italic">* Fee depends on number of copies</p>
                )}
                {location.student_discount_fee_text && (
                  <div className="flex gap-2 text-sm">
                    <Percent className="w-4 h-4 text-[#F2A900] shrink-0 mt-0.5" />
                    <p className="text-[#003A6C]"><span className="font-bold">Student Fee:</span> {location.student_discount_fee_text}</p>
                  </div>
                )}
                {location.bulk_discount_fee && (
                  <div className="flex gap-2 text-sm pl-6 border-l-2 border-[#F2A900] ml-1.5 mt-2">
                    <p className="text-[#003A6C]/80">
                      <span className="font-bold text-[#003A6C]">Bulk Deal:</span> {location.bulk_discount_fee} 
                      {location.bulk_discount_min_docs && <span className="text-xs text-[#003A6C]/50 ml-1">(Min: {location.bulk_discount_min_docs})</span>}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#003A6C]/10">
                <p className="text-xs text-[#003A6C]/60 mb-2 font-bold">Accepted Payment Methods:</p>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#003A6C] font-medium">
                  {location.accepts_cash && <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#F2A900]" /> Cash</div>}
                  {location.accepts_gcash && <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-blue-500" /> GCash</div>}
                  {location.accepts_bank_transfer && <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Bank Transfer</div>}
                </div>
              </div>
            </div>
          </section>

          {(location.feedback || location.verification_notes) && (
            <section className="space-y-3">
              <h3 className="text-xs font-bold text-[#003A6C]/50 uppercase tracking-wider">Notes & Feedback</h3>
              <div className="space-y-3">
                {location.feedback && (
                  <div className="bg-[#003A6C]/5 p-4 rounded-xl border border-[#003A6C]/20 break-words">
                    <div className="flex items-center gap-2 mb-1.5 text-[#003A6C]">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-xs font-bold">Scholar Feedback</span>
                    </div>
                    <p className="text-sm text-[#003A6C]/80 font-medium italic">"{location.feedback}"</p>
                  </div>
                )}
                {location.verification_notes && (
                  <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 break-words">
                    <div className="flex items-center gap-2 mb-1.5 text-slate-600">
                      <ShieldAlert className="w-4 h-4" />
                      <span className="text-xs font-bold">Admin Verification Note</span>
                    </div>
                    <p className="text-sm text-slate-600">{location.verification_notes}</p>
                  </div>
                )}
              </div>
            </section>
          )}

        </div>
      </SheetContent>
    </Sheet>
  );
}