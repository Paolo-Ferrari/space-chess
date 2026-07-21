import Panel from "../../panels/Panel/Panel";

import "./EventLog.css";

interface EventLogProps {
  entries: string[];
}

function EventLog({ entries }: EventLogProps) {
  return (
    <Panel eyebrow="Комлинк" title="Журнал" className="event-log">
      <ul className="event-log__list">
        {entries.map((entry, index) => (
          <li key={`${index}-${entry}`}>{entry}</li>
        ))}
      </ul>
    </Panel>
  );
}

export default EventLog;
