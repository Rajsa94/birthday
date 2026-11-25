import React from 'react';
import { useParams } from 'react-router-dom';
import DynamicInvitation from './DynamicInvitation';
import {
  getTablesForOccasion,
  createDefaultSeedOccasions,
  enrichOccasionDates,
} from '../utils/occasionStorage';

export default function InvitationRouteWrapper({
  occasions = [],
  allGuests = [],
  onSaveRSVP,
}) {
  const { occasionType, id } = useParams();

  // Resolve target occasion
  let occasion = null;

  if (id) {
    occasion = occasions.find(o => String(o.id) === String(id));
  }

  if (!occasion && occasionType) {
    occasion =
      occasions.find(o => String(o.id) === String(occasionType)) ||
      occasions.find(o => o.occasionType === occasionType);
  }

  if (!occasion) {
    occasion = occasions.find(o => o?.isActive) || occasions[0];
  }

  // Absolute fallback to default seed if storage was empty
  if (!occasion) {
    const seed = createDefaultSeedOccasions().map(enrichOccasionDates);
    occasion = seed[0];
  }

  // Get guests & tables specific to this occasion
  const occasionGuests = (allGuests || []).filter(
    g => String(g.occasionId) === String(occasion.id)
  );
  const occasionTables = getTablesForOccasion(occasion.id);

  return (
    <DynamicInvitation
      occasion={occasion}
      tables={occasionTables}
      guests={occasionGuests}
      onSaveRSVP={(newGuest) => onSaveRSVP(newGuest, occasion.id)}
    />
  );
}
