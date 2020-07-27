import React from 'react';
import OptionButton from './optionbutton/OptionButton';
import PropTypes from 'prop-types';

const OptionGroup = ({
  group_type = 'checkbox',
  available_options,
  value,
  onChosen
}) => {
  /**
   * Handle when button is checked
   * @param {Number} index - index of element in available_options
   */
  const onChecked = index => {
    //Get type by searching in the available_options
    const element = available_options[index];

    if (group_type === 'radio') onChosen(index);
    //If checkbox group
    else {
      //mutate the value list
      let new_value = [...value];

      //If exists -> uncheck
      if (new_value.includes(element))
        new_value = new_value.filter(e => e !== element);
      //If not, add to list
      else new_value.push(element);

      //Update the state
      onChosen(index);
    }
  };

  return (
    <div className="options-group">
      {available_options.map((element, index) => (
        <OptionButton
          key={index}
          /* Only checked when the state has this element */
          checked={
            group_type === 'radio'
              ? element === value //If Radio groups, choose Object
              : value.includes(available_options[index]) //If checkbox groups, choose Array
          }
          onChecked={() => onChecked(index)}
        >
          {element}
        </OptionButton>
      ))}
    </div>
  );
};

/**
 * Update the state only when the available options
 *  and value chosen is not changed
 * @param {*} prevProps - Previous Props to be checked
 * @param {*} nextProps - Next Props to be checked
 */
const shouldComponentUpdate = (prevProps, nextProps) => {
  if (
    prevProps.available_options.join() === nextProps.available_options.join() &&
    prevProps.value === nextProps.value
  )
    return true;
  else return false;
};

/**
 * Validating the prop types
 */
OptionGroup.propTypes = {
  group_type: PropTypes.string, //Specify if 'radio' or 'checkbox'
  available_options: PropTypes.array, //Available options that will display
  //What user is choosing
  value: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string,
    PropTypes.number
  ]),
  onChosen: PropTypes.func //The action when button is clicked
};

export default React.memo(OptionGroup, shouldComponentUpdate);
