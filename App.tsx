import React, {useMemo, useState} from "react";

const URL = "https://jsonplaceholder.typicode.com/users";

type Company = {
  bs: string;
  catchPhrase: string;
  name: string;
};

type User = {
  id: number;
  email: string;
  name: string;
  phone: string;
  username: string;
  website: string;
  company: Company;
  address: any
} | null;

interface IButtonProps {
  onClick: () => void;
}

const useDebounce = (Fn: Function, time = 400) => {
  let timeout: ReturnType<typeof setTimeout> | null = null
  return function <T>(this: any, ...args: Array<T>) {
    if (timeout) clearTimeout(timeout)
    const fnCall = () => Fn.apply(this, args)
    timeout = setTimeout(fnCall, time)
  }
}

const Button: React.FC<IButtonProps> = ({onClick}) => {
  return (
      <button type="button" onClick={onClick}>
        get random user
      </button>
  );
}

interface IUserInfoProps {
  user: User;
}

const UserInfo: React.FC<IUserInfoProps> = React.memo(({user}) => {
  return (
      <table>
        <thead>
        <tr>
          <th>Username</th>
          <th>Phone number</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>{user?.name}</td>
          <td>{user?.phone}</td>
        </tr>
        </tbody>
      </table>
  );
}, (prevProps, nextProps) => JSON.stringify(nextProps) === JSON.stringify(prevProps))

const App: React.FC = () => {
  const [item, setItem] = useState<User>(null);

  const receiveRandomUser = async () => {
    const id = Math.floor(Math.random() * (10 - 1)) + 1;
    const urlPath = `${URL}/${id}`
    if (sessionStorage.getItem(urlPath)) {
      const cacheData = JSON.parse(sessionStorage.getItem(urlPath) as string) as User
      setItem(cacheData)
    } else {
      const response = await fetch(urlPath);
      const _user = (await response.json()) as User;
      sessionStorage.setItem(urlPath,JSON.stringify(_user))
      setItem(_user);
    }
  };

  const debounce = useMemo(() => {
    return useDebounce(receiveRandomUser, 200)
  }, [])


  return (
      <div>
        <header>Get a random user</header>
        <Button onClick={debounce}/>
        <UserInfo user={item}/>
      </div>
  );
}

export default App;
