<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 26.09.2016
     * Time: 22:17
     */

    namespace rrshop;

    use Minishlink\WebPush\WebPush;

    require_once 'passwords.php';

    class User implements \JsonSerializable {
        private $uID;
        private $username;
        private $passwdHash;
        private $email;
        private $endpoints;
        private $pdo;

        /**
         * User constructor.
         *
         * @param int    $uID
         * @param string $username
         * @param string $passwdHash
         * @param string $email
         * @param string $endpoints
         */
        public function __construct($uID, $username, $passwdHash, $email, $endpoints) {
            $this->uID = $uID;
            $this->username = utf8_encode($username);
            $this->passwdHash = $passwdHash;
            $this->email = utf8_encode($email);
            $this->endpoints = json_decode($endpoints);
            $this->pdo = new PDO_Mysql();
        }

        /**
         * creates a new instance from a specific uID using dataO from db
         *
         * @param int $uID
         * @return User
         */
        public static function fromUID($uID) {
            $pdo = new PDO_MYSQL();
            $res = $pdo->query("SELECT * FROM db_302476_3.rrshop_user WHERE uID = :uid", [":uid" => $uID]);
            return new User($res->uID, $res->username, $res->passhash, $res->email, $res->endpoint);
        }

        /**
         * Creates a new User Object from a give username
         *
         * @param string $uName
         * @return User
         */
        public static function fromUName($uName) {
            $pdo = new PDO_MYSQL();
            $res = $pdo->query("SELECT * FROM db_302476_3.rrshop_user WHERE username = :uname", [":uname" => $uName]);
            return new User($res->uID, $res->username, $res->passhash, $res->email, $res->endpoint);
        }

        /**
         * Makes this class as an string to use for debug only
         *
         * @return string
         */
        public function __toString() {
            return
                "id:        ".$this->uID."\n".
                "usrname:   ".$this->username."\n".
                "email:     ".$this->email."\n";
        }

        /**
         * checks if a username is in the user db
         *
         * @param string $uName
         * @return bool
         */
        public static function doesUserNameExist($uName) {
            $pdo = new PDO_MYSQL();
            $res = $pdo->query("SELECT * FROM db_302476_3.rrshop_user WHERE username = :uname", [":uname" => $uName]);
            return isset($res->uID);
        }

        /**
         * Returns all entries matching the search and the page
         *
         * @param int    $page
         * @param int    $pagesize
         * @param string $search
         * @param string $sort
         *
         * @return array Normal dict array with dataO
         */
        public static function getList($page = 1, $pagesize = 75, $search = "", $sort = "") {
            $USORTING = [
                "nameAsc"  => "ORDER BY username ASC",
                "idAsc"    => "ORDER BY uID ASC",
                "nameDesc" => "ORDER BY username DESC",
                "idDesc"   => "ORDER BY uID DESC",
                "" => ""
            ];

            $pdo = new PDO_MYSQL();
            $startElem = ($page-1) * $pagesize;
            $endElem = $pagesize;
            $stmt = $pdo->queryPagedList("rrshop_user", $startElem, $endElem, ["username"], $search, $USORTING[$sort], "uID >= 0");
            $hits = self::getListMeta($page, $pagesize, $search);
            while($row = $stmt->fetchObject()) {
                array_push($hits["users"], [
                    "uID" => $row->uID,
                    "username" => utf8_encode($row->username),
                    "email" => utf8_encode($row->email),
                    "check" => md5($row->uID+$row->username+$row->email)
                ]);
            }
            return $hits;
        }

        /**
         * @see getList()
         * but you'll get Objects instead of an array
         *
         * @param int $page
         * @param int $pagesize
         * @param string $search
         *
         * @return User[]
         */
        public static function getListObjects($page = 1, $pagesize = 9999999, $search = "") {
            $pdo = new PDO_MYSQL();
            $startElem = ($page-1) * $pagesize;
            $endElem = $pagesize;
            $stmt = $pdo->queryPagedList("rrshop_user", $startElem, $endElem, ["username"], $search, "", "uID >= 0");
            $hits = [];
            while($row = $stmt->fetchObject()) {
                array_push($hits, User::fromUID($row->uID));
            }
            return $hits;
        }

        /**
         * Returns the array stub for the getList() methods
         *
         * @param int $page
         * @param int $pagesize
         * @param string $search
         * @return array
         */
        public static function getListMeta($page, $pagesize, $search) {
            $pdo = new PDO_MYSQL();
            if($search != "") $res = $pdo->query("select count(*) as size from db_302476_3.rrshop_user where lower(concat(username)) like lower(concat('%',:search,'%')) and uID >= 0", [":search" => $search]);
            else $res = $pdo->query("select count(*) as size from db_302476_3.rrshop_user where uID >= 0");
            $size = $res->size;
            $maxpage = ceil($size / $pagesize);
            return [
                "size" => $size,
                "maxPage" => $maxpage,
                "page" => $page,
                "users" => []
            ];
        }

        /**
         * Deletes a user
         *
         * @return bool
         */
        public function delete() {
            return $this->pdo->query("DELETE FROM db_302476_3.rrshop_user WHERE uID = :uid", [":uid" => $this->uID]);
        }

        /**
         * Saves the Changes made to this object to the db
         */
        public function saveChanges() {
            $this->pdo->queryUpdate("rrshop_user",
                ["username" => utf8_decode($this->username),
                 "passhash" => $this->passwdHash,
                 "email" => utf8_decode($this->email),
                 "endpoint" => json_encode($this->endpoints)],
                "uID = :uid",
                ["uid" => $this->uID]
            );
        }

        /**
         * Creates a new user from the give attribs
         *
         * @param string $username
         * @param string $passwdhash
         * @param string $email
         */
        public static function createUser($username, $passwdhash, $email) {
            $pdo = new PDO_MYSQL();
            $pdo->queryInsert("rrshop_user",
                ["username" => utf8_decode($username),
                 "passhash" => $passwdhash,
                 "endpoints" => "[]",
                 "email" => utf8_decode($email)]
            );
        }

        /**
         * Checks a users session and logs him in, also printing some debug dataO if requested
         *
         * @param bool $check
         * @return bool|User
         */
        public static function checkSession($check = false) {
            session_start();
            if(!isset($_SESSION["uID"])) {
                echo json_encode(["success" => false, "error" => "NoLogin"]);
                exit;
            } else {
                $user = User::fromUID($_SESSION["uID"]);
                if($_GET["m"] == "debug") {
                    echo "<pre style='display: block; position: absolute'>\n";
                    echo "[0] Perm Array Information:\n";
                    echo "Not available on this platform";
                    echo "\n[1] Permission Information:\n";
                    echo "Not available on this platform";
                    echo "\n[2] User Information:\n";
                    echo json_encode($user);
                    echo "\n[3] Client Information:\n";
                    echo "    Arguments: ".$_SERVER["REQUEST_URI"]."\n";
                    echo "    Req Time : ".$_SERVER["REQUEST_TIME"]."ns\n";
                    echo "    Remote IP: ".$_SERVER["REMOTE_ADDR"]."\n";
                    echo "    Usr Agent: ".$_SERVER["HTTP_USER_AGENT"]."\n";
                    echo "</pre>\n";
                } elseif($check) {
                    echo json_encode(["success" => true, "user" => $user]);
                }
                return $user;
            }
        }

        /**
         * @return int
         */
        public function getUID() {
            return $this->uID;
        }

        /**
         * @return string
         */
        public function getUName() {
            return $this->uName;
        }

        /**
         * @param string $uName
         */
        public function setUName($uName) {
            $this->uName = $uName;
        }

        /**
         * @return string
         */
        public function getUPassHash() {
            return $this->uPassHash;
        }

        /**
         * @param string $uPassHash
         */
        public function setUPassHash($uPassHash) {
            $this->uPassHash = $uPassHash;
        }

        /**
         * @return string
         */
        public function getUEmail() {
            return $this->uEmail;
        }

        /**
         * @param string $uEmail
         */
        public function setUEmail($uEmail) {
            $this->uEmail = $uEmail;
        }


        /**
         * @param string $passHash
         * @return bool
         */
        public function comparePassHash($passHash) {
            return $this->passwdHash == $passHash;
        }

        /**
         * Specify dataO which should be serialized to JSON
         *
         * @link  http://php.net/manual/en/jsonserializable.jsonserialize.php
         * @return mixed dataO which can be serialized by <b>json_encode</b>,
         *        which is a value of any type other than a resource.
         * @since 5.4.0
         */
        function jsonSerialize() {
            return [
                "uID" => $this->uID,
                "username" => $this->username,
                "email" => $this->email
            ];
        }

        public function addEndpoint($endpoint) {
            //require_once "Util.php";
            array_push($this->endpoints, $endpoint);
            //Util::sendPushNotification($endpoint);
        }

        public function disabledPush() {
            $this->endpoints = [];
        }

        public function getEndpoints() {
            return $this->endpoints;
        }

        /**
         * @param $payload string
         */
        public function sendPushNotification($payload) {
            foreach ($this->endpoints as $endpoint) {
                try {
                    $webPush = new WebPush(getAuth());
                    $defaultOptions = [
                        'TTL'       => 300, // defaults to 4 weeks
                        'urgency'   => 'normal', // protocol defaults to "normal"
                        'topic'     => 'new_event', // not defined by default,
                        'batchSize' => 200, // defaults to 1000
                    ];
                    $webPush->setDefaultOptions($defaultOptions);
                    // or for one notification
                    $webPush->sendNotification($endpoint->endpoint, $payload, $endpoint->keys->p256dh, $endpoint->keys->auth, true, ['TTL' => 5000]);
                } catch (\ErrorException $e) {

                }
            }
        }

        public static function sendOutNotifications($payload) {
            foreach (User::getListObjects() as $user) {
                $user->sendPushNotification($payload);
            }
        }
    }