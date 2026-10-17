from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from app.models.models import db

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize CORS
    CORS(
        app,
        resources={r"/api/*": {
            "origins": [
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "http://localhost:5174",
                "http://127.0.0.1:5174",
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                "*"
            ]
        }},
        supports_credentials=True
    )

    # Initialize Database
    db.init_app(app)

    # Health check endpoint
    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify({
            "status": "healthy",
            "service": "LandGuard Verification & Fraud Detection API",
            "prototype_mode": True,
            "version": "1.0.0"
        })

    # Register blueprints
    from app.routes.dashboard import dashboard_bp
    from app.routes.land_records import land_records_bp
    from app.routes.verification import verification_bp
    from app.routes.fraud_alerts import fraud_alerts_bp
    from app.routes.documents import documents_bp
    from app.routes.graph import graph_bp
    from app.routes.timeline import timeline_bp
    from app.routes.simulation import simulation_bp
    from app.routes.fraud_dna import fraud_dna_bp

    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")
    app.register_blueprint(land_records_bp, url_prefix="/api/land-records")
    app.register_blueprint(verification_bp, url_prefix="/api")
    app.register_blueprint(fraud_alerts_bp, url_prefix="/api/fraud-alerts")
    app.register_blueprint(documents_bp, url_prefix="/api/documents")
    app.register_blueprint(graph_bp, url_prefix="/api/graph")
    app.register_blueprint(timeline_bp, url_prefix="/api/timeline")
    app.register_blueprint(simulation_bp, url_prefix="/api/simulation")
    app.register_blueprint(fraud_dna_bp, url_prefix="/api/fraud-dna")

    # Centralized error handlers
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
            "success": False,
            "error": "Bad request",
            "details": str(error)
        }), 400

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            "success": False,
            "error": "Resource not found"
        }), 404

    @app.errorhandler(500)
    def internal_server_error(error):
        return jsonify({
            "success": False,
            "error": "Internal server error occurred. Please try again later."
        }), 500

    return app
