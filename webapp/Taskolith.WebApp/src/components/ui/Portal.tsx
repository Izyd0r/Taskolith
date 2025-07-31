import ReactDOM from 'react-dom'

const Portal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return ReactDOM.createPortal(children, document.body)
}
export default Portal
