<?php

namespace Drupal\custom_clock\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Block\BlockPluginInterface;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides a CustomClockBlock.
 * 
 * @Block(
 *   id = "CustomClockBlock",
 *   admin_label = @Translation("CustomClock"),
 * )
 */
class CustomClockBlock extends BlockBase implements BlockPluginInterface {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $build = array();
    $config = $this->getConfiguration();
    $dateFormat = $config['custom_clock_date_format'];
    $clock['country'] = $config['custom_clock_country'];
    $clock['city'] = $config['custom_clock_city'];
    $timezone = $config['custom_clock_time_zone_type'];
    $build['#theme'] = 'custom_clock';
    $clock['time'] = $this::customClockDateNow('custom', $dateFormat);
    $build['#clock_settings'] = $clock;
    $build['#cache'] = array('max-age' => 0);
    $js_settings = array(
      'date_format' => $dateFormat,
    );

    $build['#attached']['library'][] = 'custom_clock/custom_clock_lib';
    $build['#attached']['drupalSettings'] = $js_settings;

    return $build;
  }

  /**
   *  {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state) {
    $form = parent::blockForm($form, $form_state);
    $config = $this->getConfiguration();
    $custom_time_zone = date_default_timezone_get();

    $form['country'] = array(
      '#type' => 'textfield',
      '#title' => t('Country'),
      '#description' => t('Specify the country name'),
      '#default_value' => t('India')
    );
    $form['city'] = array(
      '#type' => 'textfield',
      '#title' => t('City'),
      '#description' => t('Specify the City name'),
      '#default_value' => t('Chennai')
    );
    $time_zone_names = system_time_zones();

    $form['time_zone_type'] = array(
      '#type' => 'select',
      '#title' => t('TimeZone'),
      '#description' => t('Select the desired timezone'),
      '#options' => $time_zone_names,
      '#default_value' => $custom_time_zone,
    );
    $form['date_format'] = array(
      '#type' => 'textfield',
      '#title' => t('Date Format'),
      '#description' => t('Specify the custom date format'),
      '#default_value' => 'jS M Y - h:i A',
    );

    return $form;
  }

  /**
   *  {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state) {
    $this->setConfigurationValue('custom_clock_country', $form_state->getValue('country'));
    $this->setConfigurationValue('custom_clock_city', $form_state->getValue('city'));
    $this->setConfigurationValue('custom_clock_date_format', $form_state->getValue('date_format'));
    $this->setConfigurationValue('custom_clock_time_zone_type', $form_state->getValue('time_zone_type'));
  }

  /**
   *  {@inheritdoc}
   */
  protected function customClockGetTimezone($date_format_date = FALSE) {
    $config = $this->getConfiguration();
    $time_zone = $config['custom_clock_time_zone_type'];
    return $time_zone;
  }

    /**
   *  {@inheritdoc}
   */
  protected function customClockDateFormat() {
    $config = $this->getConfiguration();
    $date_format = (!empty($config['custom_clock_date_format'])) ? $config['custom_clock_date_format'] : 'long';
    return $date_format;
  }

  /**
   * Gets the formatted date.
   *
   * @param string $type
   *   Date type string.
   * @param string $format
   *   PHP date format.
   *
   * @return string
   *   The formatted date used for the clock.
   */
  protected function customClockDateNow($type, $format = '') {
    // Get current language code.
    $language_interface = \Drupal::languageManager()->getCurrentLanguage();
    $langcode = $language_interface->getId();

    //Calling custom services to inject date formatter objects- Dependency Injection)
    $date_formatter = \Drupal::service('custom_clock.custom_services')->getDateFormatter();
    $formatted_date = $date_formatter->format(time(), $type, $format, $this::customClockGetTimezone(TRUE), $langcode);
    return $formatted_date;
  }
}
