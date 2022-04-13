import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { UnstyledUl } from '../styles/mixins';
import { MenuSettings } from '../types/hopalong';
import { Button } from './common/Button';
import Checkbox from './common/Checkbox';
import Dropdown from './common/Dropdown';
import Slider from './common/Slider';

export type ControllerProps = {
  settings: MenuSettings;
  onChange: (settings: Partial<MenuSettings>) => unknown;
  onReset: () => unknown;
};
export default function Controller({ settings, onChange, onReset }: ControllerProps) {
  const NORMALISE_ROTATION_SPEED = 1000;
  const NORMALISE_POINTS = 0.001;
  const [isAdvancedValues, toggleAdvancedValues] = useState(false);
  const rotateDir = settings.rotationSpeed < 0;
  const maxValues = {
    speed: [50, 100],
    rotationSpeed: [50, 100],
    cameraFov: [120, 180],
    points: [50, 100],
    subsetCount: [10, 20],
    levelCount: [10, 20],
  };
  const getMaxValues = ([regular, advanced]: number[]): number => {
    return isAdvancedValues ? advanced : regular;
  };

  const updateSetting = (newSettings: Partial<MenuSettings>) => {
    onChange(newSettings);
  };
  const getRotationSpeed = (s: number, dir: boolean) => {
    return Math.abs(s) * (dir ? -1 : 1);
  };



}