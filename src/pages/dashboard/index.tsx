import GlobalLayout from '../../components/layout';
import Flow from '../../components/graph';

import './dashboard.css';

export default function Dashboard() {
  document.title='Dashboard';
  return (
    <GlobalLayout>
      <div className='graph-div'>
        <Flow />
      </div>
    </GlobalLayout>
  );
}
