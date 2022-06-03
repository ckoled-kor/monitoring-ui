import { CheckCircleTwoTone, ExclamationCircleTwoTone, WarningTwoTone } from '@ant-design/icons';
import { useState, useCallback, createContext, useContext, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  Background,
  Controls,
  MiniMap,
  MarkerType
} from 'react-flow-renderer';
import Popup from 'reactjs-popup';

import { useAuth } from '../config/auth';
import { BffApiService } from '../services/bffApi';
import { IService } from '../interfaces';

import ServiceInfo from './serviceInfo';

const staticServices = require('./services.json');

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const PopupContext = createContext([] as any);

export default function Flow() {
  const auth = useAuth();
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState({} as IService);
  const [services, setServices] = useState([] as IService[]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );
  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    setSelectedService(services.find((e: any) => e.serviceName === node.data.name)!)
    setShowModal(true);
  }
  const closeModal = () => setShowModal(false)

  useEffect(() => {
    const serviceNodes: Node[] = [];
    const serviceEdges: Edge[] = [];
    
    const getServices = async () => {
      const services = staticServices;
      // const api = new BffApiService(auth.apiToken!);
      // const services = await api.getServices();
      services?.services.forEach((svc: IService, i: number) => {
        serviceNodes.push({ 
          id: svc.serviceName,
          data: { label: <div style={{
            width: '115%',
            margin: '-8px 0px -13px -8px',
            display: 'grid',
            gridAutoColumns: '10%'
          }}>
            <h3 style={{
              gridRow: 1,
              gridColumnStart: 2,
              gridColumnEnd: 10,
              justifySelf: 'center'
            }}>{svc.serviceName}</h3>
            {svc.healthStatus.status.match(/^(UP|OK)$/)?<CheckCircleTwoTone twoToneColor="#52c41a" style={{
              gridRow: 1,
              gridColumn: 10,
              justifySelf: 'end',
              fontSize: 10,
              fontWeight: 'bold'
            }}/>:
            <ExclamationCircleTwoTone twoToneColor='red' style={{
              gridRow: 1,
              gridColumn: 10,
              justifySelf: 'end',
              fontSize: 10,
              fontWeight: 'bold'
            }}/>}
            {svc.logErrorStatus && <WarningTwoTone twoToneColor='orange' style={{
              gridRow: 1,
              gridColumn: 10,
              justifySelf: 'end',
              alignSelf: 'end',
              marginBottom: '5px',
              fontSize: 10,
              fontWeight: 'bold'
            }}/>}
          </div>, name: svc.serviceName },
          position: { x: 0, y: 100*i },
          style: {
            width: 120
          }
        })
        svc.healthStatus.components && Object.keys(svc.healthStatus.components).forEach((dep) => {
          serviceEdges.push({
            id: `${svc.serviceName}-${dep}`,
            source: svc.serviceName,
            target: dep,
            animated: true,
            markerEnd: {
              type: MarkerType.ArrowClosed
            }
          })
        })
      })
      setNodes(serviceNodes);
      setEdges(serviceEdges);
      setServices(services!.services);
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
      >
        <Background />
        <Controls />
        {/* <MiniMap /> */}
      </ReactFlow>
      <PopupContext.Provider value={[showModal, setShowModal]}>
        <Popup open={showModal} onClose={closeModal}>
          <ServiceInfo service={selectedService}/>
        </Popup>
      </PopupContext.Provider>
    </>
  )
}

export function usePopupContext() {
  return useContext(PopupContext);
}