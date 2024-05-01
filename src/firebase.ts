import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyDkihlrydVromcXh_ihj7VX94XmJFnxOOM',
  authDomain: 'rootpe-todo.firebaseapp.com',
  projectId: 'rootpe-todo',
  storageBucket: 'rootpe-todo.appspot.com',
  messagingSenderId: '662373788005',
  appId: '1:662373788005:web:75924bc5f005c13ea7d98c'
};

export const app = initializeApp(firebaseConfig);
