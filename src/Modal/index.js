import alert from './alert';
import Modal from './modal';
import operation from './operation';
import prompt from './prompt';

import './style/index.css';

Modal.alert = alert;
Modal.prompt = prompt;
Modal.operation = operation;

export default Modal;
