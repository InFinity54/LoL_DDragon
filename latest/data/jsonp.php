<?php
header("content-type: text/javascript");

if(isset($_GET['lang']) && isset($_GET['type']))
{
  if(isset($_GET['sub']))
  {
    $file = $_GET['lang'].'/'.$_GET['type'].'/'.$_GET['sub'].'.json';
    $callback = $_GET['sub'];
  }
  else
  {
    $file = $_GET['lang'].'/'.$_GET['type'].'.json';
    $callback = $_GET['type'];
  }
  echo 'rg_data_callback_'.$callback.'(' . file_get_contents($file) . ');';
}