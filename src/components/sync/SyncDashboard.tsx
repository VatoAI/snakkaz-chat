
import { SyncStatus } from "./SyncStatus";
import { DomainStatus } from "./DomainStatus";
import { GitHubStatus } from "./GitHubStatus";

export const SyncDashboard = () => {
  const domains = [
    'api.snakkaz.io',
    'app.snakkaz.io',
    'cdn.snakkaz.io',
    'auth.snakkaz.io'
  ];
  
  return (
    <div className="mt-8 mb-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <GitHubStatus />
      </div>
      <div>
        <SyncStatus />
      </div>
      <div className="lg:col-span-3">
        <DomainStatus domains={domains} />
      </div>
    </div>
  );
};
