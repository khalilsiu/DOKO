import { makeStyles } from '@material-ui/core';
import { memo, ReactNode } from 'react';
import clsx from 'clsx';

interface IBullet {
  data: {
    title: ReactNode;
    value: ReactNode;
  }[];
  className?: string;
  color: string;
}

const Bullet = ({ data, className, color }: IBullet) => {
  const styles = useStyles();
  return (
    <div className={clsx(styles.bullet, className)}>
      <div className={styles.borderLeft} style={{ backgroundColor: color }} />
      <div className={styles.content}>
        {data.map((datum, index) => (
          <div key={index} className={styles.datum}>
            {datum.title}
            {datum.value}
          </div>
        ))}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  borderLeft: {
    width: '40px',
    borderRadius: '15px 0px 0px 15px',
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: theme.spacing(3),
  },
  datum: {
    flex: '1',
  },
  bullet: {
    display: 'flex',
    width: '350px',
    background: 'rgba(255,255,255,0.25)',
    borderRadius: '15px',
  },
}));

export default memo(Bullet);
