export function getEffectiveHours(startTime: Date, endTime: Date): number {
  const hoursWorked = (endTime.getTime() - startTime.getTime()) / 3600000;
  const minutesWorked = hoursWorked * 60;
  const effectiveHours =
    minutesWorked % 60 > 15
      ? Math.floor(hoursWorked) + 1
      : Math.floor(hoursWorked);

  return effectiveHours || 0;
}
