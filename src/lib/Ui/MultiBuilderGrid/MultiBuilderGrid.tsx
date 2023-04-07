import React from "react";
import Grid from "../Grid/Grid";

type ButtonProps = {
  onClick: any;
  title: string;
  className?: string;
};

const Button = ({ onClick, title, className = "bg-red text-white" }: ButtonProps) => (
  <p className={`px-m py-s rounded-l pointer ${className}`} onClick={onClick}>
    {title}
  </p>
);

type MultiBuilderGridProps = {
  service: any;
  showToggle?: boolean;
  builders: { [key: string]: any };
  stateKey?: string;
  className?: string;
};

const MultiBuilderGrid = ({ service, builders, showToggle = true, stateKey, className }: MultiBuilderGridProps) => {
  [service.cardTemplate, service.setCardTemplate] = React.useState(localStorage.getItem(`${service.id}-builder`) || Object.keys(builders)[0]);
  return (
    <React.Fragment>
      <div className="row-center self-start gap-m bg-prim px-m rounded-l py-s mx-m">
        <p className="text-shark">Card Template : </p>
        {showToggle &&
          Object.keys(builders).map((card, i) => (
            <Button
              className={card === service.cardTemplate ? "bg-cyan text-black" : "bg-prince text-owl"}
              key={i}
              onClick={() => {
                localStorage.setItem(`${service.id}-builder`, card);
                service.setCardTemplate(card);
              }}
              title={`${card}`}
            />
          ))}
      </div>
      <Grid service={service} itemBuilder={builders[service.cardTemplate] ?? Object.values(builders)[0]} className={className} stateKey={stateKey} />
    </React.Fragment>
  );
};

export default MultiBuilderGrid;
