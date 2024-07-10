import { Provider } from 'react-redux';
import FormComponent from '../app/Form/FormComponent.jsx';
import { store } from '../Redux/Store.js';

export default function Home() {
  return (
    <div className="container mx-auto">
      <FormComponent />
    </div>
  );
}
