"use client";

import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const AVSRuleSelector = () => {
  const [selections, setSelections] = useState({
    zipMatchStreetMatch: true,
    zipMatchStreetNoMatch: false,
    zipNoMatchStreetMatch: false,
    zipNoMatchStreetNoMatch: false,
  });

  const findMatchingRule = useCallback(() => {
    const {
      zipMatchStreetMatch,
      zipMatchStreetNoMatch,
      zipNoMatchStreetMatch,
      zipNoMatchStreetNoMatch
    } = selections;

    if (zipMatchStreetMatch && !zipMatchStreetNoMatch && !zipNoMatchStreetMatch && !zipNoMatchStreetNoMatch) {
      return 1; // Only pass if both match
    } else if (zipMatchStreetMatch && zipMatchStreetNoMatch && !zipNoMatchStreetMatch && !zipNoMatchStreetNoMatch) {
      return 2; // Pass if ZIP matches
    } else if (!zipMatchStreetMatch && zipNoMatchStreetMatch && !zipNoMatchStreetNoMatch) {
      return 3; // Only pass if both match
    } else if (zipNoMatchStreetMatch) {
      return 4; // Pass if Street matches
    } else if (zipNoMatchStreetNoMatch) {
      return 6; // Always pass everything
    } else if (!zipMatchStreetMatch && !zipNoMatchStreetMatch && !zipNoMatchStreetNoMatch) {
      return 5; // Block only if both fail
    }
    return null; // No matching rule
  }, [selections]);

  const handleToggle = (key) => {
    setSelections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const rule = findMatchingRule();

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>AVS Rule Selector</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
            <div>
              <p className="font-medium">ZIP Match + Street Match</p>
              <p className="text-sm text-gray-600">Allow transactions when both ZIP and Street match</p>
            </div>
            <Switch
              checked={selections.zipMatchStreetMatch}
              onCheckedChange={() => handleToggle('zipMatchStreetMatch')}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
            <div>
              <p className="font-medium">ZIP Match + Street No Match</p>
              <p className="text-sm text-gray-600">Allow transactions when ZIP matches but Street doesn't</p>
            </div>
            <Switch
              checked={selections.zipMatchStreetNoMatch}
              onCheckedChange={() => handleToggle('zipMatchStreetNoMatch')}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
            <div>
              <p className="font-medium">ZIP No Match + Street Match</p>
              <p className="text-sm text-gray-600">Allow transactions when ZIP doesn&#39;t match but Street does</p>
            </div>
            <Switch
              checked={selections.zipNoMatchStreetMatch}
              onCheckedChange={() => handleToggle('zipNoMatchStreetMatch')}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
            <div>
              <p className="font-medium">ZIP No Match + Street No Match</p>
              <p className="text-sm text-gray-600">Allow transactions when neither ZIP nor Street match</p>
            </div>
            <Switch
              checked={selections.zipNoMatchStreetNoMatch}
              onCheckedChange={() => handleToggle('zipNoMatchStreetNoMatch')}
            />
          </div>
        </div>

        {rule ? (
          <Alert className="mt-6">
            <AlertTitle>Recommended Rule: {rule}</AlertTitle>
            <AlertDescription>
              {rule === 1 && "This configuration only allows transactions when both ZIP and Street match."}
              {rule === 2 && "This configuration allows transactions as long as the ZIP matches."}
              {rule === 3 && "This configuration only allows transactions when both ZIP and Street match."}
              {rule === 4 && "This configuration allows transactions as long as the Street matches."}
              {rule === 5 && "This configuration blocks transactions only when both ZIP and Street fail."}
              {rule === 6 && "This configuration allows all transactions regardless of AVS results."}
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="mt-6" variant="destructive">
            <AlertTitle>No Matching Rule</AlertTitle>
            <AlertDescription>
              Your selected combination doesn&#39;t match any predefined AVS rules. Please adjust your selections.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default AVSRuleSelector;
