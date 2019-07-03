declare const Zone;

export function scheduleOutsideOfZone(scheduledFn: () => void) {
	Zone.root.run(() => setTimeout(() => scheduledFn()));
}
