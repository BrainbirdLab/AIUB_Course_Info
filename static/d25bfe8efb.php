<?php

class AntiAdBlock {

    const TRANSPORT_CURL              = 1;
    const TRANSPORT_FILE_GET_CONTENTS = 2;
    const TRANSPORT_SOCKET            = 3;

    /**
     * @var string
     */
    private $zoneId = '5868738-5868739';

    /**
     * @var string
     */
    private $key = 'RejMvfzWk3XoGomDYWvPoFQOOEqfbSN49VivWxoETKg7PgkYf2qEIAHrGifqqvKC';

    /**
     * @var string
     */
    private $domain = 'hilltopads.com';

    /**
     * @var string
     */
    private $path = '/api/publisher/antiAdBlock';

    /**
     * @var string
     */
    private $version = '1.0';

    /**
     * @var string
     */
    private $userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36';

    /**
     * @var array
     */
    private $urlParams = array();

    private function makeRequest() {
        $response = $this->makeCurlRequest();

        if ($response === false) {
            $response = $this->makeFileGetContentsRequest();

            if ($response === false) {
                $response = $this->makeSocketRequest();
            }
        }

        $result = '';

        if (! empty($response)) {
            $response = json_decode($response, true);

            if (isset($response['result']['code'])) {
                $result = $response['result']['code'];
            }
        }

        return $result;
    }

    private function getUrl($transport) {
        return $this->domain . $this->getPath($transport);
    }

    private function getPath($transport) {
        $queryParams = array_merge($this->urlParams, array(
                    'zoneId'    => $this->getZoneId(),
                    'key'       => $this->key,
                    'version'   => $this->version,
                    'transport' => $transport
        ));

        return $this->path . '?' . http_build_query($queryParams);
    }

    private function makeCurlRequest() {
        if (! extension_loaded('curl') || ! function_exists('curl_init')) {
            return false;
        }

        $resource = curl_init();

        curl_setopt_array($resource, array(
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_HEADER         => false,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_FOLLOWLOCATION => false,
            CURLOPT_USERAGENT      => $this->userAgent
        ));

        $version = curl_version();
        $url     = $this->getUrl(self::TRANSPORT_CURL);

        if ($version['features'] & CURL_VERSION_SSL) {
            curl_setopt($resource, CURLOPT_URL, 'https://' . $url);
        } else {
            curl_setopt($resource, CURLOPT_URL, 'http://' . $url);
        }

        $response = curl_exec($resource);
        curl_close($resource);

        return $response;
    }

    private function makeFileGetContentsRequest() {
        if (! function_exists('file_get_contents') ||
            ! ini_get('allow_url_fopen') ||
            (function_exists('stream_get_wrappers') && ! in_array('http', stream_get_wrappers()))) {
            return false;
        }

        $url = $this->getUrl(self::TRANSPORT_FILE_GET_CONTENTS);

        if (function_exists('stream_get_wrappers') && in_array('https', stream_get_wrappers())) {
            $response = file_get_contents('https://' . $url);
        } else {
            $response = file_get_contents('http://' . $url);
        }

        return $response;
    }

    private function makeSocketRequest() {
        $resource = null;

        if (function_exists('stream_get_wrappers') && in_array('https', stream_get_wrappers())) {
            $resource = fsockopen('ssl://' . $this->domain, 443);
        }

        if (! $resource) {
            $resource = fsockopen('tcp://' . gethostbyname($this->domain), 80);
        }

        if (! $resource) {
            return false;
        }

        $headers  = "GET " . $this->getPath(self::TRANSPORT_SOCKET) . " HTTP/1.1\r\n";
        $headers .= "Host: " . $this->domain . "\r\n";
        $headers .= "User-Agent: " . $this->userAgent . "\r\n";
        $headers .= "Connection: close\r\n\r\n";

        fwrite($resource, $headers);

        $response = '';

        while (! feof($resource)) {
            $response .= fgets($resource, 1024);
        }

        fclose($resource);

        $response = substr($response, strpos($response, "\r\n\r\n") + 4);
        $response = substr($response, strpos($response, "{"));
        $response = substr($response, 0, strrpos($response, "}") + 1);

        return $response;
    }

    private function getTempDir() {
        if (! function_exists('sys_get_temp_dir')) {
            foreach (['TMP', 'TMPDIR', 'TEMP'] as $envKey) {
                if (! empty($_ENV[$envKey])) {
                    return realpath($_ENV[$envKey]);
                }
            }

            $tempFile = tempnam(dirname(__FILE__), '');

            if (file_exists($tempFile)) {
                unlink($tempFile);
                return realpath(dirname($tempFile));
            }

            return null;
        } else {
            return sys_get_temp_dir();
        }
    }

    private function getZoneId() {
        if (is_numeric($this->zoneId)) {
            return $this->zoneId;
        }

        $zoneIds      = explode('-', $this->zoneId);
        $this->zoneId = $zoneIds[0];
        $userAgent    = $_SERVER['HTTP_USER_AGENT'];

        if (count($zoneIds) === 2 && (
                stristr($userAgent, 'mobi') !== false ||
                stristr($userAgent, 'ipad') !== false ||
                stristr($userAgent, 'iphone') !== false ||
                stristr($userAgent, 'blackberry') !== false ||
                stristr($userAgent, 'android') !== false
            )
        ) {
            $this->zoneId = $zoneIds[1];
        }

        return $this->zoneId;
    }

    public function getCode() {
        $errorLevel = error_reporting(0);

        if (! empty($_GET)) {
            $this->urlParams = $_GET;
        }

        $file = $this->getTempDir() . '/hta-' . $this->getZoneId() . md5(serialize($this->urlParams)) . '.js';

        if (file_exists($file) && time() - filemtime($file) < 300) {
            error_reporting($errorLevel);

            return file_get_contents($file);
        }

        $code = $this->makeRequest();

        if (! empty($code)) {
            file_put_contents($file, $code);
        }

        error_reporting($errorLevel);

        return $code;
    }
}

header('Content-Type: application/javascript');
$antiAdBlock = new AntiAdBlock();
echo $antiAdBlock->getCode();