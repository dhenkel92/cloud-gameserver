export function gameConfigStatusToColor(status: string): string {
  switch (status) {
    case 'STARTING':
    case 'STOPPING':
      return 'orange';
    case 'RUNNING':
      return 'green';
    default:
      return 'red';
  }
}
