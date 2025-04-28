import classes from "./loadingspinner.module.css";

interface LoadingSpinnerProps {

}

export default function LoadingSpinner({}: LoadingSpinnerProps) {
  return (
      <div className={classes.loader}/>
  );
};