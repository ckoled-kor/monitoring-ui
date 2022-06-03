import { useState, useCallback, createContext, useContext, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  FitViewOptions,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  Background,
  Controls,
  MarkerType
} from 'react-flow-renderer';
import Popup from 'reactjs-popup';

import ServiceInfo from './serviceInfo';

const initialNodes: Node[] = [
  { id: '1', data: { label: 'Node 1' }, position: { x: 5, y: 5 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 5, y: 100 } },
];

const initialEdges: Edge[] = [];

const fitViewOptions: FitViewOptions = {
  padding: 0.2
}

const PopupContext = createContext([] as any);

export default function Flow() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState('');

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge({...connection, markerEnd:{
      type: MarkerType.ArrowClosed,
    }}, eds)),
    [setEdges]
  );
  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    setSelectedService(node.data.name)
    setShowModal(true);
  }
  const closeModal = () => setShowModal(false)

  useEffect(() => {
    const serviceNodes: Node[] = [];
    
    const getServices = async () => {
      const services = [
        {
          "contactInfo": {
            "name": "Scott MacCombie",
            "email": "scott.maccombie@porsche.digital"
          },
          "healthStatus": {
            "components": {
              "Vehicle Info Service": "UP"
            },
            "status": "OK"
          },
          "serviceName": "One Sales",
          "lastUpdateTS": "2022-06-02T22:50:25Z",
          "team": "Targa Acquired"
        },
        {
          "contactInfo": {
            "name": "Ben Fletcher",
            "email": "ben.fletcher@porsche.digital"
          },
          "healthStatus": {
            "status": "UP"
          },
          "serviceName": "Vehicle Info Service",
          "lastUpdateTS": "2022-06-02T22:50:25Z",
          "team": "Platform"
        }
      ]
      services.forEach((svc, i) => serviceNodes.push({ 
        id: `${i}`,
        data: { label: `${svc.serviceName} ${svc.healthStatus.status}`, name: svc.serviceName },
        position: { x: 0, y: 100*i }
      }))
      console.log(serviceNodes)
      setNodes(serviceNodes);
    }
    getServices();
  }, [])

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={fitViewOptions}
      >
        <Background />
        <Controls />
      </ReactFlow>
      <PopupContext.Provider value={[showModal, setShowModal]}>
        <Popup open={showModal} onClose={closeModal}>
          <ServiceInfo serviceName={selectedService}/>
        </Popup>
      </PopupContext.Provider>
    </>
  )
}

export function usePopupContext() {
  return useContext(PopupContext);
}