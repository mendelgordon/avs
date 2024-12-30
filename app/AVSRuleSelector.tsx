"use client";

import React, { useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const AVSRuleSelector = () => {
	const [selectedRuleCriteria, setSelectedRuleCriteria] = useState<string | null>(null);

	const findMatchingRule = useCallback(() => {
		switch (selectedRuleCriteria) {
			case "zipAndStreet":
				return 1; // Only pass if ZIP AND STREET are a match (also corresponds to rule 3's application)
			case "onlyZip":
				return 2; // Pass as long as ZIP is a match
			case "onlyStreet":
				return 4; // Pass as long as STREET is a match
			case "neitherRequired":
				return 6; // Always Pass the transaction
			case "blockIfNeither":
				return 5; // Block only if ZIP AND STREET FAIL
			default:
				return null;
		}
	}, [selectedRuleCriteria]);

	const handleRuleChange = (value: string) => {
		setSelectedRuleCriteria(value);
	};

	const rule = findMatchingRule();

	return (
		<Card className="w-full max-w-2xl">
			<CardHeader>
				<CardTitle>AVS Rule Selector</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<RadioGroup onValueChange={handleRuleChange} value={selectedRuleCriteria}>
					<div className="space-y-4">
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="zipAndStreet" id="rule1" />
							<Label htmlFor="rule1">
								<p className="font-medium">Both ZIP and Street must match</p>
								<p className="text-sm text-gray-600">Only allow transactions if both ZIP and Street addresses match.</p>
							</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="onlyZip" id="rule2" />
							<Label htmlFor="rule2">
								<p className="font-medium">Only ZIP needs to match</p>
								<p className="text-sm text-gray-600">Allow transactions as long as the ZIP code matches, regardless of the Street address.</p>
							</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="onlyStreet" id="rule4" />
							<Label htmlFor="rule4">
								<p className="font-medium">Only Street needs to match</p>
								<p className="text-sm text-gray-600">Allow transactions as long as the Street address matches, regardless of the ZIP code.</p>
							</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="neitherRequired" id="rule6" />
							<Label htmlFor="rule6">
								<p className="font-medium">Neither needs to match (Always Pass)</p>
								<p className="text-sm text-gray-600">Allow all transactions regardless of whether ZIP or Street match.</p>
							</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="blockIfNeither" id="rule5" />
							<Label htmlFor="rule5">
								<p className="font-medium">Block only if neither matches</p>
								<p className="text-sm text-gray-600">Block transactions only when both ZIP and Street addresses do not match.</p>
							</Label>
						</div>
					</div>
				</RadioGroup>

				{rule ? (
					<Alert className="mt-6">
						<AlertTitle>Recommended Rule: {rule}</AlertTitle>
						<AlertDescription>
							{rule === 1 && "This configuration only allows transactions when both ZIP and Street match."}
							{rule === 2 && "This configuration allows transactions as long as the ZIP matches."}
							{rule === 4 && "This configuration allows transactions as long as the Street matches."}
							{rule === 5 && "This configuration blocks transactions only when both ZIP and Street fail."}
							{rule === 6 && "This configuration allows all transactions regardless of AVS results."}
						</AlertDescription>
					</Alert>
				) : null}

				{!rule && selectedRuleCriteria && (
					<Alert className="mt-6" variant="destructive">
						<AlertTitle>No Direct Rule Mapping</AlertTitle>
						<AlertDescription>The selected criteria doesn't directly map to a single predefined AVS rule in the matrix. This might represent a custom or less common configuration.</AlertDescription>
					</Alert>
				)}
			</CardContent>
		</Card>
	);
};

export default AVSRuleSelector;
