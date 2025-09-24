/**
 * Utilities for working with deals and deal stages
 */
import { Deal } from '../types/deal';

/**
 * Compare a deal's stage with a stage ID string
 * This safely handles comparison between DealStage objects and stage ID strings
 * 
 * @param deal The deal object containing a stage property
 * @param stageId The stage ID string to compare with
 * @returns boolean indicating if the deal's stage matches the given ID
 */
export function isDealInStage(deal: Deal, stageId: string): boolean {
  // Check if deal.stage is an object with an id property
  if (deal.stage && typeof deal.stage === 'object' && 'id' in deal.stage) {
    return deal.stage.id === stageId;
  }
  
  // Fallback for cases where stage might be a string (unexpected but handled)
  // @ts-ignore - This is a fallback for runtime safety
  return deal.stage === stageId;
}

/**
 * Get the stage ID from a deal
 * This safely extracts the ID regardless of whether stage is an object or string
 * 
 * @param deal The deal object
 * @returns The stage ID string
 */
export function getDealStageId(deal: Deal): string {
  if (deal.stage && typeof deal.stage === 'object' && 'id' in deal.stage) {
    return deal.stage.id;
  }
  
  // Fallback for cases where stage might be a string (unexpected but handled)
  // @ts-ignore - This is a fallback for runtime safety
  return deal.stage || '';
}

/**
 * Check if a deal is NOT in any of the specified stages
 * 
 * @param deal The deal object
 * @param stageIds Array of stage IDs to check against
 * @returns boolean indicating if the deal is NOT in any of the given stages
 */
export function isDealNotInStages(deal: Deal, stageIds: string[]): boolean {
  const dealStageId = getDealStageId(deal);
  return !stageIds.includes(dealStageId);
}
